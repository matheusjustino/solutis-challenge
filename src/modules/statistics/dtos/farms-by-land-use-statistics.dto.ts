import { ApiProperty } from '@nestjs/swagger';

export class FarmsByLandUseStatisticsDTO {
	@ApiProperty({ type: String, description: 'Name of the area' })
	public name: string;

	@ApiProperty({ type: Number, description: 'Area size' })
	public value: number;
}
