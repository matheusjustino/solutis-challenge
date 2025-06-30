import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
	BadRequestException,
	Inject,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

// COMMANDS
import { DeleteProducerCommand } from '../impl/delete-producer.command';

// REPOSITORIES
import { ProducerRepository } from '../../producer.repository';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(DeleteProducerCommand)
export class DeleteProducerHandler
	implements ICommandHandler<DeleteProducerCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(DeleteProducerHandler.name);

	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute(
		payload: DeleteProducerCommand,
	): Promise<CreateCommandDTO> {
		this.logger.log(
			`Executing... payload: ${JSON.stringify(payload, null, 4)}`,
		);

		const producerExists = await this.producerRepository.find({
			where: {
				id: payload.producerId,
			},
			select: {
				ownerId: true,
			},
		});
		if (!producerExists) {
			throw new NotFoundException('Producer not found');
		}
		if (producerExists.ownerId !== payload.ownerId) {
			throw new UnauthorizedException('You can not perform this action');
		}

		const deletedProducer = await this.producerRepository.delete({
			where: {
				id: payload.producerId,
				ownerId: payload.ownerId,
			},
			select: {
				id: true,
			},
		});
		if (!deletedProducer) {
			throw new BadRequestException('Error while deleting producer');
		}

		await this.cacheHelper.clear();

		return {
			id: deletedProducer.id,
		};
	}
}
