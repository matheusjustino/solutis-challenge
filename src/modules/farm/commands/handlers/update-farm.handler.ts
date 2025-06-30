import {
	BadRequestException,
	Inject,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Farm } from '@prisma/client';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// COMMANDS
import { UpdateFarmCommand } from '../impl/update-farm.command';

// REPOSITORIES
import { FarmRepository } from '../../farm.repository';
import { ProducerRepository } from '@/modules/producer/producer.repository';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(UpdateFarmCommand)
export class UpdateFarmHandler
	implements ICommandHandler<UpdateFarmCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(UpdateFarmHandler.name);

	@Inject(FarmRepository)
	private readonly farmRepository: FarmRepository;
	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute({
		ownerId,
		farmId,
		producerId,
		...payload
	}: UpdateFarmCommand): Promise<CreateCommandDTO> {
		this.logger.log(
			`Executing... payload: ${JSON.stringify({ ownerId, farmId, producerId, ...payload }, null, 4)}`,
		);

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

		const farmExists = await this.farmRepository.find({
			where: {
				id: farmId,
				producerId,
			},
		});
		if (!farmExists) {
			throw new NotFoundException('Farm not found');
		}

		this.validateFarmPayload(payload, farmExists);

		const updatedFarm = await this.farmRepository.update({
			where: {
				id: farmExists.id,
				producer: {
					id: producerId,
					ownerId,
				},
			},
			data: payload,
			select: {
				id: true,
			},
		});
		if (!updatedFarm) {
			throw new BadRequestException('Error while updating the farm');
		}

		await this.cacheHelper.clear();

		return {
			id: updatedFarm.id,
		};
	}

	private validateFarmPayload(
		payload: Pick<
			UpdateFarmCommand,
			| 'arableAreaHectares'
			| 'totalAreaHectares'
			| 'vegetationAreaHectares'
		>,
		farm: Farm,
	): void {
		const finalArableArea =
			payload.arableAreaHectares ?? farm.arableAreaHectares;
		const finalVegetationArea =
			payload.vegetationAreaHectares ?? farm.vegetationAreaHectares;
		const finalTotalArea =
			payload.totalAreaHectares ?? farm.totalAreaHectares;

		if (finalArableArea + finalVegetationArea > finalTotalArea) {
			throw new BadRequestException(
				'Arable area + Vegetation area can not be greater than total area',
			);
		}
	}
}
