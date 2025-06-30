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
import { UpdateProducerCommand } from '../impl/update-producer.command';

// REPOSITORIES
import { ProducerRepository } from '../../producer.repository';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(UpdateProducerCommand)
export class UpdateProducerHandler
	implements ICommandHandler<UpdateProducerCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(UpdateProducerHandler.name);

	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute({
		ownerId,
		producerId,
		...payload
	}: UpdateProducerCommand): Promise<CreateCommandDTO> {
		this.logger.log(
			`Executing... payload: ${JSON.stringify({ ownerId, producerId, ...payload }, null, 4)}`,
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

		const updatedProducer = await this.producerRepository.update({
			where: {
				id: producerId,
				ownerId: ownerId,
			},
			data: payload,
			select: {
				id: true,
			},
		});
		if (!updatedProducer) {
			throw new BadRequestException('Error while updating producer');
		}

		await this.cacheHelper.clear();

		return {
			id: updatedProducer.id,
		};
	}
}
