// ENTITIES
import { PlantedCultureEntity } from '@/modules/planted-culture/entities/planted-culture.entity';

export class CultureEntity {
	public id: string;
	public name: string;
	public plantedOnFarms?: Partial<PlantedCultureEntity[]>;
	public createdAt: Date;
	public updatedAt: Date;

	constructor(data: CultureEntity) {
		Object.assign(this, {
			...data,
			plantedOnFarms: data.plantedOnFarms ?? [],
		});
	}
}
