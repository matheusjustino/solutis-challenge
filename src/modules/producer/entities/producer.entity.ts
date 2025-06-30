// ENTITIES
import { UserEntity } from '@/modules/auth/entities/user.entity';
import { FarmEntity } from '@/modules/farm/entities/farm.entity';

export class ProducerEntity {
	public id: string;
	public document: string;
	public name: string;
	public ownerId: string;
	public owner?: Partial<UserEntity>;
	public farms?: Partial<FarmEntity[]>;
	public createdAt: Date;
	public updatedAt: Date;

	constructor(data: ProducerEntity) {
		Object.assign(this, {
			...data,
			farms: data.farms ?? [],
		});
	}
}
