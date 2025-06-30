import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

// REPOSITORIES
import { ProducerRepository } from '../../producer.repository';

// QUERIES
import { ListProducersQuery } from '../impl/list-producers.query';

// DTOs
import { ResultListDTO } from '@/common/dtos/result-list.dto';

@QueryHandler(ListProducersQuery)
export class ListProducersHandler implements IQueryHandler<ListProducersQuery> {
	private readonly logger: Logger = new Logger(ListProducersHandler.name);

	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;

	public async execute(query: ListProducersQuery) {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const { items, count } = await this.producerRepository.list({
			where: {
				ownerId: query.ownerId,
			},
			take: query?.perPage ?? 10,
			skip: ((query?.page || 1) - 1) * (query?.perPage ?? 10),
		});

		return new ResultListDTO({
			items,
			total: count,
			perPage: query.perPage,
			page: query.page,
		});
	}
}
