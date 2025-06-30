import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// ENTITIES
import { CultureEntity } from './entities/culture.entity';

// INTERFACES
import { DatabaseConnectionInterface } from '@/infrastructure/database/database-connection.interface';

@Injectable()
export class CultureRepository {
	@Inject(ConstantsEnum.DATABASE)
	private readonly database: DatabaseConnectionInterface;

	public async create(
		data: Prisma.CultureCreateArgs,
	): Promise<CultureEntity> {
		return await this.database.culture.create(data);
	}

	public async find(
		data: Prisma.CultureFindFirstArgs,
	): Promise<CultureEntity> {
		return await this.database.culture.findFirst(data);
	}

	public async listAll(): Promise<CultureEntity[]> {
		return await this.database.culture.findMany();
	}

	public async list(
		data: Prisma.CultureFindManyArgs,
	): Promise<{ items: CultureEntity[]; count: number }> {
		const [items, count] = await this.database.$transaction([
			this.database.culture.findMany(data),
			this.database.culture.aggregate({
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

	public async update(
		data: Prisma.CultureUpdateArgs,
	): Promise<CultureEntity> {
		return await this.database.culture.update(data);
	}

	public async delete(
		data: Prisma.CultureDeleteArgs,
	): Promise<CultureEntity> {
		return await this.database.culture.delete(data);
	}
}
