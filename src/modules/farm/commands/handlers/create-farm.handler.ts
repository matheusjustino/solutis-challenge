import {
	BadRequestException,
	Inject,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// COMMANDS
import { CreateFarmCommand } from '../impl/create-farm.command';

// REPOSITORIES
import { FarmRepository } from '../../farm.repository';
import { ProducerRepository } from '@/modules/producer/producer.repository';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(CreateFarmCommand)
export class CreateFarmHandler
	implements ICommandHandler<CreateFarmCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(CreateFarmHandler.name);

	@Inject(FarmRepository)
	private readonly farmRepository: FarmRepository;
	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute({
		ownerId,
		producerId,
		...payload
	}: CreateFarmCommand): Promise<CreateCommandDTO> {
		this.logger.log(
			`Executing... payload: ${JSON.stringify({ ownerId, producerId, ...payload }, null, 4)}`,
		);

		this.validateFarmPayload(payload);

		const producer = await this.producerRepository.find({
			where: {
				id: producerId,
			},
			select: {
				ownerId: true,
			},
		});
		if (!producer) {
			throw new NotFoundException('Producer not found');
		}
		if (producer.ownerId !== ownerId) {
			throw new UnauthorizedException('You can not perform this action');
		}

		const newFarm = await this.farmRepository.create({
			data: {
				...payload,
				producerId,
			},
			select: {
				id: true,
			},
		});
		if (!newFarm) {
			throw new BadRequestException('Error while creating new farm');
		}

		await this.cacheHelper.clear();

		return {
			id: newFarm.id,
		};
	}

	private validateFarmPayload(
		payload: Pick<
			CreateFarmCommand,
			| 'arableAreaHectares'
			| 'totalAreaHectares'
			| 'vegetationAreaHectares'
		>,
	): void {
		if (
			payload.arableAreaHectares + payload.vegetationAreaHectares >
			payload.totalAreaHectares
		) {
			throw new BadRequestException(
				'Arable area + Vegetation area can not be greater than total area',
			);
		}
	}
}
