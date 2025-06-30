import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// DTOs
import { FarmDTO } from '../../dtos/farm.dto';

// REPOSITORIES
import { FarmRepository } from '../../farm.repository';

// QUERIES
import { ListAllFarmsQuery } from '../impl/list-all-farms.query';

@QueryHandler(ListAllFarmsQuery)
export class ListAllFarmsHandler
	implements IQueryHandler<ListAllFarmsQuery, FarmDTO[]>
{
	private readonly logger: Logger = new Logger(ListAllFarmsHandler.name);

	@Inject(FarmRepository)
	private readonly farmRepository: FarmRepository;

	public async execute(query: ListAllFarmsQuery): Promise<FarmDTO[]> {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const farms = await this.farmRepository.listAll(query.ownerId);
		return farms.map((farm) => new FarmDTO(farm));
	}
}
