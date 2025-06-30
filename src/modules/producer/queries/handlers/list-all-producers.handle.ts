import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// QUERIES
import { ListAllProducers } from '../impl/list-all-producers.query';

// DTOs
import { ProducerDTO } from '../../dtos/producer.dto';

// REPOSITORIES
import { ProducerRepository } from '../../producer.repository';

@QueryHandler(ListAllProducers)
export class ListAllProducersHandler
	implements IQueryHandler<ListAllProducers, ProducerDTO[]>
{
	private readonly logger: Logger = new Logger(ListAllProducersHandler.name);

	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;

	public async execute(query: ListAllProducers): Promise<ProducerDTO[]> {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const producers = await this.producerRepository.listAll(query.ownerId);
		return producers.map((producer) => new ProducerDTO(producer));
	}
}
