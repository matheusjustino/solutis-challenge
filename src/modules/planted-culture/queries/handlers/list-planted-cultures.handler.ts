import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// DTOs
import { ResultListDTO } from '@/common/dtos/result-list.dto';

// QUERIES
import { ListPlantedCulturesQuery } from '../impl/list-planted-cultures.query';

// REPOSITORIES
import { PlantedCultureRepository } from '../../planted-culture.repository';

@QueryHandler(ListPlantedCulturesQuery)
export class ListPlantedCulturesHandler
	implements IQueryHandler<ListPlantedCulturesQuery>
{
	private readonly logger: Logger = new Logger(
		ListPlantedCulturesHandler.name,
	);

	@Inject(PlantedCultureRepository)
	private readonly plantedCultureRepository: PlantedCultureRepository;

	public async execute(query: ListPlantedCulturesQuery) {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const { items, count } = await this.plantedCultureRepository.list({
			where: {
				farm: {
					producer: {
						ownerId: query.ownerId,
						...(query?.producerId && { id: query.producerId }),
					},
					...(query?.farmId && { id: query.farmId }),
				},
			},
			take: query?.perPage ?? 10,
			skip: ((query?.page || 1) - 1) * (query?.perPage ?? 10),
			include: {
				culture: {
					select: {
						name: true,
					},
				},
			},
		});

		return new ResultListDTO({
			items,
			total: count,
			perPage: query.perPage,
			page: query.page,
		});
	}
}
