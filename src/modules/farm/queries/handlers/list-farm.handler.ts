import {
	Inject,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// DTOs
import { ResultListDTO } from '@/common/dtos/result-list.dto';

// QUERIES
import { ListFarmsQuery } from '../impl/list-farms.query';

// REPOSITORIES
import { FarmRepository } from '../../farm.repository';
import { ProducerRepository } from '@/modules/producer/producer.repository';
import { FarmDTO } from '../../dtos/farm.dto';

@QueryHandler(ListFarmsQuery)
export class ListFarmsHandler
	implements IQueryHandler<ListFarmsQuery, ResultListDTO<FarmDTO>>
{
	private readonly logger: Logger = new Logger(ListFarmsHandler.name);

	@Inject(FarmRepository)
	private readonly farmRepository: FarmRepository;
	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;

	public async execute(
		query: ListFarmsQuery,
	): Promise<ResultListDTO<FarmDTO>> {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		if (query.producerId) {
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
				throw new UnauthorizedException(
					'You can not perform this action',
				);
			}
		}

		const { items, count } = await this.farmRepository.list({
			where: {
				producer: {
					ownerId: query.ownerId,
					...(query.producerId && { id: query.producerId }),
				},
			},
			take: query?.perPage ?? 10,
			skip: ((query?.page || 1) - 1) * (query?.perPage ?? 10),
		});

		return new ResultListDTO({
			items: items.map((farmEntity) => new FarmDTO(farmEntity)),
			total: count,
			perPage: query.perPage,
			page: query.page,
		});
	}
}
