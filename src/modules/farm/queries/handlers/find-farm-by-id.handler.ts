import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
	Inject,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

// QUERIES
import { FindFarmByIdQuery } from '../impl/find-farm-by-id.query';

// REPOSITORIES
import { FarmRepository } from '../../farm.repository';
import { ProducerRepository } from '@/modules/producer/producer.repository';

// DTOs
import { FarmDTO } from '../../dtos/farm.dto';

@QueryHandler(FindFarmByIdQuery)
export class FindFarmByIdHandler
	implements IQueryHandler<FindFarmByIdQuery, FarmDTO>
{
	private readonly logger: Logger = new Logger(FindFarmByIdHandler.name);

	@Inject(FarmRepository)
	private readonly farmRepository: FarmRepository;
	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;

	public async execute(query: FindFarmByIdQuery): Promise<FarmDTO> {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const producerExists = await this.producerRepository.find({
			where: {
				id: query.producerId,
			},
			select: {
				ownerId: true,
			},
		});
		if (!producerExists) {
			throw new NotFoundException('Producer not found');
		}
		if (producerExists.ownerId !== query.ownerId) {
			throw new UnauthorizedException('You can not perform this action');
		}

		const farm = await this.farmRepository.find({
			where: {
				id: query.farmId,
				producer: {
					id: query.producerId,
					ownerId: query.ownerId,
				},
			},
			include: {
				plantedCultures: true,
			},
		});
		if (!farm) {
			throw new NotFoundException('Farm not found');
		}

		return new FarmDTO(farm);
	}
}
