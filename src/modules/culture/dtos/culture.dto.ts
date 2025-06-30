import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ENTITIES
import { CultureEntity } from '../entities/culture.entity';

// DTOs
import { PlantedCultureDTO } from '@/modules/planted-culture/dtos/planted-culture.dto';

export class CultureDTO {
	@ApiProperty({ type: String })
	public id: string;

	@ApiProperty({ type: String })
	public name: string;

	@ApiPropertyOptional({ type: () => [PlantedCultureDTO] })
	public plantedOnFarms?: PlantedCultureDTO[];

	@ApiProperty({ type: Date })
	public createdAt: Date;

	@ApiProperty({ type: Date })
	public updatedAt: Date;

	constructor(data: Partial<CultureEntity>) {
		Object.assign(this, {
			...data,
			plantedOnFarms: data?.plantedOnFarms
				? data.plantedOnFarms.map((item) => new PlantedCultureDTO(item))
				: [],
		});
	}
}
