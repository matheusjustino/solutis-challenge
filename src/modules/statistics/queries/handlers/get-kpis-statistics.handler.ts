import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// INTERFACES
import { DatabaseConnectionInterface } from '@/infrastructure/database/database-connection.interface';

// QUERIES
import { GetKpisStatisticsQuery } from '../impl/get-kpis-statistics.query';

// DTOs
import { KpisStatisticsDTO } from '../../dtos/kpis-statistics.dto';

@QueryHandler(GetKpisStatisticsQuery)
export class GetKpisStatisticsHandler
	implements IQueryHandler<GetKpisStatisticsQuery, KpisStatisticsDTO>
{
	private readonly logger: Logger = new Logger(GetKpisStatisticsHandler.name);

	@Inject(ConstantsEnum.DATABASE)
	private readonly database: DatabaseConnectionInterface;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute(
		query: GetKpisStatisticsQuery,
	): Promise<KpisStatisticsDTO> {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const cacheKey = `kpi:${JSON.stringify(query)}`;
		const dataExists = await this.cacheHelper.get(cacheKey);
		if (dataExists) {
			return JSON.parse(dataExists);
		}

		const result = await this.database.farm.aggregate({
			where: {
				producer: {
					ownerId: query.ownerId,
					...(query?.producerId && { id: query.producerId }),
				},
			},
			_count: {
				id: true,
			},
			_sum: {
				totalAreaHectares: true,
			},
		});

		await this.cacheHelper.set(
			cacheKey,
			JSON.stringify({
				totalFarms: result._count.id || 0,
				totalAreaHectares: result._sum.totalAreaHectares || 0,
			}),
		);

		return {
			totalFarms: result._count.id || 0,
			totalAreaHectares: result._sum.totalAreaHectares || 0,
		};
	}
}
