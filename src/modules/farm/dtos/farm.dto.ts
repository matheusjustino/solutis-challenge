import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FarmState } from '@prisma/client';

// ENTITIES
import { FarmEntity } from '../entities/farm.entity';

// DTOs
import { ProducerDTO } from '@/modules/producer/dtos/producer.dto';
import { PlantedCultureDTO } from '@/modules/planted-culture/dtos/planted-culture.dto';

export class FarmDTO {
	@ApiProperty({ type: String })
	public id: string;

	@ApiProperty({ type: String })
	public name: string;

	@ApiProperty({ type: String })
	public city: string;

	@ApiProperty({ enum: FarmState })
	public state: FarmState;

	@ApiProperty({ type: String })
	public producerId: string;

	@ApiPropertyOptional({ type: () => ProducerDTO })
	public producer?: ProducerDTO;

	@ApiProperty({ type: () => [PlantedCultureDTO] })
	public plantedCultures?: PlantedCultureDTO[];

	@ApiProperty({ type: Number })
	public totalAreaHectares: number;

	@ApiProperty({ type: Number })
	public arableAreaHectares: number;

	@ApiProperty({ type: Number })
	public vegetationAreaHectares: number;

	@ApiProperty({ type: Date })
	public createdAt: Date;

	@ApiProperty({ type: Date })
	public updatedAt: Date;

	constructor(data: Partial<FarmEntity>) {
		this.id = data.id;
		this.name = data.name;
		this.city = data.city;
		this.state = data.state;
		this.producerId = data.producerId;
		this.totalAreaHectares = data.totalAreaHectares;
		this.arableAreaHectares = data.arableAreaHectares;
		this.vegetationAreaHectares = data.vegetationAreaHectares;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		if (data.producer) {
			this.producer = new ProducerDTO(data.producer);
		}

		if (data.plantedCultures && data.plantedCultures.length > 0) {
			this.plantedCultures = data.plantedCultures.map(
				(culture) => new PlantedCultureDTO(culture),
			);
		}
	}
}
