// ENTITIES
import { CultureEntity } from '@/modules/culture/entities/culture.entity';
import { FarmEntity } from '@/modules/farm/entities/farm.entity';

export class PlantedCultureEntity {
	public id: string;
	public harvestName: string;
	public farmId: string;
	public farm?: Partial<FarmEntity>;
	public cultureId: string;
	public culture?: Partial<CultureEntity>;
	public createdAt: Date;

	constructor(data: PlantedCultureEntity) {
		Object.assign(this, data);
	}
}
