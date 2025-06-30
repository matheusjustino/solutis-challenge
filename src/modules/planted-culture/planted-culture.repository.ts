import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// ENTITIES
import { PlantedCultureEntity } from './entities/planted-culture.entity';

// INTERFACES
import { DatabaseConnectionInterface } from '@/infrastructure/database/database-connection.interface';

@Injectable()
export class PlantedCultureRepository {
	@Inject(ConstantsEnum.DATABASE)
	private readonly database: DatabaseConnectionInterface;

	public async create(
		data: Prisma.PlantedCultureCreateArgs,
	): Promise<PlantedCultureEntity> {
		return await this.database.plantedCulture.create(data);
	}

	public async list(
		data: Prisma.PlantedCultureFindManyArgs,
	): Promise<{ items: PlantedCultureEntity[]; count: number }> {
		const [items, count] = await this.database.$transaction([
			this.database.plantedCulture.findMany(data),
			this.database.plantedCulture.aggregate({
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
}
