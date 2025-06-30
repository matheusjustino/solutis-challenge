import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
	BadRequestException,
	Inject,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// COMMANDS
import { DeleteFarmCommand } from '../impl/delete-farm.command';

// REPOSITORIES
import { FarmRepository } from '../../farm.repository';
import { ProducerRepository } from '@/modules/producer/producer.repository';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(DeleteFarmCommand)
export class DeleteFarmHandler
	implements ICommandHandler<DeleteFarmCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(DeleteFarmHandler.name);

	@Inject(FarmRepository)
	private readonly farmRepository: FarmRepository;
	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute(
		payload: DeleteFarmCommand,
	): Promise<CreateCommandDTO> {
		this.logger.log(
			`Executing... payload: ${JSON.stringify(payload, null, 4)}`,
		);

		const { ownerId, farmId, producerId } = payload;

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
			select: {
				id: true,
			},
		});
		if (!farmExists) {
			throw new NotFoundException('Farm not found');
		}

		const deletedFarm = await this.farmRepository.delete({
			where: {
				id: farmExists.id,
				producer: {
					id: producerId,
					ownerId,
				},
			},
			select: {
				id: true,
			},
		});
		if (!deletedFarm) {
			throw new BadRequestException('Error while deleting the farm');
		}

		await this.cacheHelper.clear();

		return {
			id: deletedFarm.id,
		};
	}
}
