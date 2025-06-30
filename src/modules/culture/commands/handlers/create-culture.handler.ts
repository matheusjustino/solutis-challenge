import {
	BadRequestException,
	Inject,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// REPOSITORIES
import { CultureRepository } from '../../culture.repository';

// COMMANDS
import { CreateCultureCommand } from '../impl/create-culture.command';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(CreateCultureCommand)
export class CreateCultureHandler
	implements ICommandHandler<CreateCultureCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(CreateCultureHandler.name);

	@Inject(CultureRepository)
	private readonly cultureRepository: CultureRepository;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute(
		payload: CreateCultureCommand,
	): Promise<CreateCommandDTO> {
		try {
			this.logger.log(
				`Executing... payload: ${JSON.stringify(payload, null, 4)}`,
			);

			const newCulture = await this.cultureRepository.create({
				data: payload,
				select: {
					id: true,
				},
			});
			if (!newCulture) {
				throw new BadRequestException(
					'Error while creating new culture',
				);
			}

			await this.cacheHelper.clear();

			return {
				id: newCulture.id,
			};
		} catch (e) {
			this.logger.error(e);
			if (e?.code === 'P2002') {
				throw new BadRequestException(
					'A new culture cannot be created with this name',
				);
			}

			throw new InternalServerErrorException('Internal server error');
		}
	}
}
