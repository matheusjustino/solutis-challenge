// ENTITIES
import { ProducerEntity } from '@/modules/producer/entities/producer.entity';

export class UserEntity {
	public id: string;
	public email: string;
	public password: string;
	public producers?: Partial<ProducerEntity[]>;
	public createdAt: Date;
	public updatedAt: Date;

	constructor(data: UserEntity) {
		Object.assign(this, {
			...data,
			producers: data?.producers ?? [],
		});
	}
}
