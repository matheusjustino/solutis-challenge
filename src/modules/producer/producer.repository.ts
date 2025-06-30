import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// ENTITIES
import { ProducerEntity } from './entities/producer.entity';

// INTERFACES
import { DatabaseConnectionInterface } from '@/infrastructure/database/database-connection.interface';

@Injectable()
export class ProducerRepository {
	@Inject(ConstantsEnum.DATABASE)
	private readonly database: DatabaseConnectionInterface;

	public async create(
		data: Prisma.ProducerCreateArgs,
	): Promise<ProducerEntity> {
		return await this.database.producer.create(data);
	}

	public async listAll(ownerId: string): Promise<ProducerEntity[]> {
		return await this.database.producer.findMany({
			where: {
				ownerId,
			},
		});
	}

	public async list(data: Prisma.ProducerFindManyArgs): Promise<{
		items: ProducerEntity[];
		count: number;
	}> {
		const [items, count] = await this.database.$transaction([
			this.database.producer.findMany(data),
			this.database.producer.aggregate({
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

	public async find(
		data: Prisma.ProducerFindFirstArgs,
	): Promise<ProducerEntity> {
		return await this.database.producer.findFirst(data);
	}

	public async update(
		data: Prisma.ProducerUpdateArgs,
	): Promise<ProducerEntity> {
		return await this.database.producer.update(data);
	}

	public async delete(
		data: Prisma.ProducerDeleteArgs,
	): Promise<ProducerEntity> {
		return await this.database.producer.delete(data);
	}
}
