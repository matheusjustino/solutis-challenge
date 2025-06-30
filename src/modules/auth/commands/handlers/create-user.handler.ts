import {
	BadRequestException,
	Inject,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// INTERFACES
import { HashHelperInterface } from '@/common/interfaces/hash-helper.interface';

// REPOSITORIES
import { AuthRepository } from '../../auth.repository';

// COMMANDS
import { CreateUserCommand } from '../impl/create-user.command';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
	implements ICommandHandler<CreateUserCommand, CreateCommandDTO>
{
	private readonly logger: Logger = new Logger(CreateUserHandler.name);

	@Inject(AuthRepository)
	private readonly repository: AuthRepository;
	@Inject(ConstantsEnum.HASH_HELPER)
	private readonly hashHelper: HashHelperInterface;

	public async execute(
		payload: CreateUserCommand,
	): Promise<CreateCommandDTO> {
		this.logger.log(
			`Executing... payload: ${JSON.stringify(payload, null, 4)}`,
		);

		try {
			payload.password = await this.hashHelper.hash(payload.password);
			const { id } = await this.repository.create(payload);

			return {
				id,
			};
		} catch (e) {
			this.logger.error(e);
			if (e?.code === 'P2002') {
				throw new BadRequestException(
					'A new user cannot be created with this email',
				);
			}

			throw new InternalServerErrorException('Internal server error');
		}
	}
}
