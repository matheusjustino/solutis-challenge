import { Inject, Injectable, NotFoundException } from '@nestjs/common';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// INTERFACES
import { DatabaseConnectionInterface } from '@/infrastructure/database/database-connection.interface';

// Commands
import { CreateUserCommand } from './commands/impl/create-user.command';

// ENTITIES
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthRepository {
	@Inject(ConstantsEnum.DATABASE)
	private readonly database: DatabaseConnectionInterface;

	public async create(payload: CreateUserCommand): Promise<UserEntity> {
		return await this.database.user.create({
			data: payload,
		});
	}

	public async findByEmail(email: string): Promise<UserEntity> {
		const user = await this.database.user.findFirst({
			where: {
				email,
			},
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	public async findById(id: string): Promise<UserEntity> {
		const user = await this.database.user.findFirst({
			where: {
				id,
			},
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}
}
