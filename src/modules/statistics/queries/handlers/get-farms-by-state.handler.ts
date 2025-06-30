import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';
import { GetFarmsByFilterEnum } from '../../enums/get-farms-by-filter.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// INTERFACES
import { DatabaseConnectionInterface } from '@/infrastructure/database/database-connection.interface';

// DTOs
import { FarmsByStatisticsDTO } from '../../dtos/farms-by-statistics.dto';

// QUERIES
import { GetFarmsByStateStatisticsQuery } from './../impl/get-farms-by-state.query';

@QueryHandler(GetFarmsByStateStatisticsQuery)
export class GetFarmsByStateStatisticsHandler
	implements
		IQueryHandler<GetFarmsByStateStatisticsQuery, FarmsByStatisticsDTO>
{
	private readonly logger: Logger = new Logger(
		GetFarmsByStateStatisticsHandler.name,
	);

	@Inject(ConstantsEnum.DATABASE)
	private readonly database: DatabaseConnectionInterface;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute(
		query: GetFarmsByStateStatisticsQuery,
	): Promise<FarmsByStatisticsDTO> {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const cacheKey = `farms-by:${JSON.stringify(query)}`;
		const dataExists = await this.cacheHelper.get(cacheKey);
		if (dataExists) {
			return JSON.parse(dataExists);
		}

		const requestedFilters = new Set(query.by);

		const statePromise = requestedFilters.has(GetFarmsByFilterEnum.STATE)
			? this.calculateByState(query)
			: Promise.resolve(null);

		const culturePromise = requestedFilters.has(
			GetFarmsByFilterEnum.CULTURE,
		)
			? this.calculateByCulture(query)
			: Promise.resolve(null);

		const landUsePromise = requestedFilters.has(GetFarmsByFilterEnum.LAND)
			? this.calculateByLandUse(query)
			: Promise.resolve(null);

		const [byState, byCulture, byLandUse] = await Promise.all([
			statePromise,
			culturePromise,
			landUsePromise,
		]);

		await this.cacheHelper.set(
			cacheKey,
			JSON.stringify({
				byState,
				byCulture,
				byLandUse,
			}),
		);

		return {
			byState,
			byCulture,
			byLandUse,
		};
	}

	private async calculateByState(
		query: Pick<GetFarmsByStateStatisticsQuery, 'ownerId' | 'producerId'>,
	): Promise<
		{
			state: string;
			count: number;
		}[]
	> {
		const result = await this.database.farm.groupBy({
			by: ['state'],
			where: {
				producer: {
					ownerId: query.ownerId,
					...(query?.producerId && { id: query.producerId }),
				},
			},
			_count: {
				_all: true,
			},
			orderBy: {
				_count: {
					state: 'desc',
				},
			},
		});

		return result.map((item) => ({
			state: item.state,
			count: item._count._all,
		}));
	}

	private async calculateByCulture(
		query: Pick<GetFarmsByStateStatisticsQuery, 'ownerId' | 'producerId'>,
	): Promise<
		{
			name: string;
			count: number;
		}[]
	> {
		const plantedCultures = await this.database.plantedCulture.groupBy({
			by: ['cultureId'],
			where: {
				farm: {
					producer: {
						ownerId: query.ownerId,
						...(query?.producerId && { id: query.producerId }),
					},
				},
			},
			_count: {
				_all: true,
			},
			orderBy: {
				_count: {
					cultureId: 'desc',
				},
			},
		});

		const cultureIds = plantedCultures.map((item) => item.cultureId);
		const cultures = await this.database.culture.findMany({
			where: {
				id: {
					in: cultureIds,
				},
			},
			select: {
				id: true,
				name: true,
			},
		});
		const cultureMap = new Map(cultures.map((c) => [c.id, c.name]));

		return plantedCultures.map((item) => ({
			name: cultureMap.get(item.cultureId) || 'Unknown',
			count: item._count._all,
		}));
	}

	private async calculateByLandUse(
		query: Pick<GetFarmsByStateStatisticsQuery, 'ownerId' | 'producerId'>,
	): Promise<
		{
			name: string;
			value: number;
		}[]
	> {
		const result = await this.database.farm.aggregate({
			where: {
				producer: {
					ownerId: query.ownerId,
					...(query?.producerId && { id: query.producerId }),
				},
			},
			_sum: {
				arableAreaHectares: true,
				vegetationAreaHectares: true,
			},
		});

		return [
			{
				name: 'Arable area',
				value: result._sum.arableAreaHectares || 0,
			},
			{
				name: 'Vegetation area',
				value: result._sum.vegetationAreaHectares || 0,
			},
		];
	}
}
