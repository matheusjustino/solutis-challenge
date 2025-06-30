import {
	BadRequestException,
	Inject,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// REPOSITORIES
import { CultureRepository } from '../../culture.repository';

// COMMANDS
import { UpdateCultureCommand } from '../impl/update-culture.command';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(UpdateCultureCommand)
export class UpdateCultureHandler
	implements ICommandHandler<UpdateCultureCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(UpdateCultureHandler.name);

	@Inject(CultureRepository)
	private readonly cultureRepository: CultureRepository;
	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute(
		payload: UpdateCultureCommand,
	): Promise<CreateCommandDTO> {
		try {
			this.logger.log(
				`Executing... payload: ${JSON.stringify(payload, null, 4)}`,
			);

			const cultureExists = await this.cultureRepository.find({
				where: {
					id: payload.cultureId,
				},
				select: {
					name: true,
				},
			});
			if (!cultureExists) {
				throw new NotFoundException('Culture not found');
			}

			if (payload.name === cultureExists.name) {
				return {
					id: payload.cultureId,
				};
			}

			const updatedCulture = await this.cultureRepository.update({
				where: {
					id: payload.cultureId,
				},
				data: {
					name: payload.name,
				},
				select: {
					id: true,
				},
			});
			if (!updatedCulture) {
				throw new BadRequestException(
					'Error while updating new culture',
				);
			}

			await this.cacheHelper.clear();

			return {
				id: updatedCulture.id,
			};
		} catch (e) {
			this.logger.error(e);
			if (e?.code === 'P2002') {
				throw new BadRequestException(
					'A culture with this name already exists',
				);
			}

			throw new InternalServerErrorException('Internal server error');
		}
	}
}
