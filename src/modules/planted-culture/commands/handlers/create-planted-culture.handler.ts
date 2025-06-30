import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
	BadRequestException,
	HttpException,
	Inject,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HELPERS
import { CacheHelper } from '@/common/helpers/cache.helper';

// REPOSITORIES
import { PlantedCultureRepository } from '../../planted-culture.repository';
import { FarmRepository } from '@/modules/farm/farm.repository';
import { CultureRepository } from '@/modules/culture/culture.repository';
import { ProducerRepository } from '@/modules/producer/producer.repository';

// COMMANDS
import { CreatePlantedCultureCommand } from '../impl/create-planted-culture.command';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(CreatePlantedCultureCommand)
export class CreatePlantedCultureHandler
	implements ICommandHandler<CreatePlantedCultureCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(
		CreatePlantedCultureHandler.name,
	);

	@Inject(PlantedCultureRepository)
	private readonly plantedCultureRepository: PlantedCultureRepository;
	@Inject(ProducerRepository)
	private readonly producerRepository: ProducerRepository;
	@Inject(FarmRepository)
	private readonly farmRepository: FarmRepository;
	@Inject(CultureRepository)
	private readonly cultureRepository: CultureRepository;

	@Inject(ConstantsEnum.CACHE_HELPER)
	private readonly cacheHelper: CacheHelper;

	public async execute(
		payload: CreatePlantedCultureCommand,
	): Promise<CreateCommandDTO> {
		try {
			this.logger.log(
				`Executing... payload: ${JSON.stringify(payload, null, 4)}`,
			);

			const [producer, farm, culture] = await Promise.all([
				this.producerRepository.find({
					where: {
						id: payload.producerId,
					},
					select: {
						ownerId: true,
					},
				}),
				this.farmRepository.find({
					where: {
						id: payload.farmId,
					},
				}),
				this.cultureRepository.find({
					where: {
						id: payload.cultureId,
					},
				}),
			]);
			if (!producer) {
				throw new NotFoundException('Producer not found');
			}
			if (!farm) {
				throw new NotFoundException('Farm not found');
			}
			if (!culture) {
				throw new NotFoundException('Culture not found');
			}

			if (producer.ownerId !== payload.ownerId) {
				throw new UnauthorizedException(
					'You can not perform this action',
				);
			}

			const newPlantedCulture =
				await this.plantedCultureRepository.create({
					data: {
						harvestName: payload.harvestName,
						farmId: payload.farmId,
						cultureId: payload.cultureId,
					},
					select: {
						id: true,
					},
				});
			if (!newPlantedCulture) {
				throw new BadRequestException(
					'Error while creating new planted culture',
				);
			}

			await this.cacheHelper.clear();

			return {
				id: newPlantedCulture.id,
			};
		} catch (e) {
			this.logger.error(e);

			if (e instanceof HttpException) {
				throw e;
			}

			if (e?.code === 'P2002') {
				throw new BadRequestException(
					'A new planted culture cannot be created with the same culture, farm and harvestName',
				);
			}

			throw new InternalServerErrorException('Internal server error');
		}
	}
}
