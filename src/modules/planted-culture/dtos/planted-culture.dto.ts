import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ENTITIES
import { PlantedCultureEntity } from '../entities/planted-culture.entity';

// DTOs
import { CultureDTO } from '@/modules/culture/dtos/culture.dto';
import { FarmDTO } from '@/modules/farm/dtos/farm.dto';

export class PlantedCultureDTO {
	@ApiProperty({ type: String })
	public id: string;

	@ApiProperty({ type: String })
	public harvestName: string;

	@ApiProperty({ type: String })
	public farmId: string;

	@ApiPropertyOptional({ type: () => FarmDTO })
	public farm?: FarmDTO;

	@ApiProperty({ type: String })
	public cultureId: string;

	@ApiPropertyOptional({ type: () => CultureDTO })
	public culture?: CultureDTO;

	@ApiProperty({ type: Date })
	public createdAt: Date;

	constructor(data: Partial<PlantedCultureEntity>) {
		Object.assign(this, {
			...data,
			farm: data?.farm ? new FarmDTO(data.farm) : null,
			culture: data?.culture ? new CultureDTO(data.culture) : null,
		});
	}
}
