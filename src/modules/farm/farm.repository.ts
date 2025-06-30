import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// ENTITIES
import { FarmEntity } from './entities/farm.entity';

// INTERFACES
import { DatabaseConnectionInterface } from '@/infrastructure/database/database-connection.interface';

@Injectable()
export class FarmRepository {
	@Inject(ConstantsEnum.DATABASE)
	private readonly database: DatabaseConnectionInterface;

	public async create(data: Prisma.FarmCreateArgs): Promise<FarmEntity> {
		return await this.database.farm.create(data);
	}

	public async listAll(ownerId: string): Promise<FarmEntity[]> {
		return await this.database.farm.findMany({
			where: {
				producer: {
					ownerId,
				},
			},
		});
	}

	public async list(
		data: Prisma.FarmFindManyArgs,
	): Promise<{ items: FarmEntity[]; count: number }> {
		const [items, count] = await this.database.$transaction([
			this.database.farm.findMany(data),
			this.database.farm.aggregate({
				where: data.where,
				_count: {
					_all: true,
				},
			}),
		]);

		return {
			items,
			count: count._count._all,
		};
	}

	public async find(data: Prisma.FarmFindFirstArgs): Promise<FarmEntity> {
		return await this.database.farm.findFirst(data);
	}

	public async update(data: Prisma.FarmUpdateArgs): Promise<FarmEntity> {
		return await this.database.farm.update(data);
	}

	public async delete(data: Prisma.FarmDeleteArgs): Promise<FarmEntity> {
		return await this.database.farm.delete(data);
	}
}
