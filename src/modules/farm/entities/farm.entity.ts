import { FarmState } from '@prisma/client';

// ENTITIES
import { ProducerEntity } from '@/modules/producer/entities/producer.entity';
import { PlantedCultureEntity } from '@/modules/planted-culture/entities/planted-culture.entity';

export class FarmEntity {
	public id: string;
	public name: string;
	public city: string;
	public state: FarmState;
	public totalAreaHectares: number;
	public arableAreaHectares: number;
	public vegetationAreaHectares: number;
	public producerId: string;
	public producer?: Partial<ProducerEntity>;
	public plantedCultures?: Partial<PlantedCultureEntity[]>;
	public createdAt: Date;
	public updatedAt: Date;

	constructor(data: FarmEntity) {
		Object.assign(this, {
			...data,
			plantedCultures: data.plantedCultures ?? [],
		});
	}
}
