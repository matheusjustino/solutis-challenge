import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

// REPOSITORIES
import { ProducerRepository } from '../../producer.repository';

// QUERIES
import { FindProducerByIdQuery } from '../impl/find-by-id.query';

@QueryHandler(FindProducerByIdQuery)
export class FindByIdHandler implements IQueryHandler<FindProducerByIdQuery> {
	private readonly logger: Logger = new Logger(FindByIdHandler.name);

	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;

	public async execute(query: FindProducerByIdQuery) {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const producer = await this.producerRepository.find({
			where: {
				id: query.producerId,
				ownerId: query.ownerId,
			},
			include: {
				owner: {
					select: {
						id: true,
						email: true,
					},
				},
				farms: true,
			},
		});
		if (!producer) {
			throw new NotFoundException('Producer not found');
		}

		return producer;
	}
}
