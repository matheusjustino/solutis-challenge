import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
	BadRequestException,
	Inject,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';

// REPOSITORY
import { ProducerRepository } from '../../producer.repository';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// COMMANDS
import { CreateProducerCommand } from '../impl/create-producer.command';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(CreateProducerCommand)
export class CreateProducerHandler
	implements ICommandHandler<CreateProducerCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(CreateProducerHandler.name);

	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute(
		payload: CreateProducerCommand,
	): Promise<CreateCommandDTO> {
		try {
			this.logger.log(
				`Executing... payload: ${JSON.stringify(payload, null, 4)}`,
			);

			const newProducer = await this.producerRepository.create({
				data: {
					owner: {
						connect: {
							id: payload.ownerId,
						},
					},
					name: payload.name,
					document: payload.document,
				},
				select: {
					id: true,
				},
			});

			await this.cacheHelper.clear();

			return {
				id: newProducer.id,
			};
		} catch (e) {
			this.logger.error(e);
			if (e?.code === 'P2002') {
				throw new BadRequestException(
					'A new producer cannot be created with this document',
				);
			}

			throw new InternalServerErrorException('Internal server error');
		}
	}
}
