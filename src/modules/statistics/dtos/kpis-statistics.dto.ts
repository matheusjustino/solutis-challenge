import { ApiProperty } from '@nestjs/swagger';

export class KpisStatisticsDTO {
	@ApiProperty({
		type: Number,
		description: 'Total farms by owner. It can be filtered by producer',
	})
	public totalFarms: number;

	@ApiProperty({
		type: Number,
		description:
			'Total farms area by owner. It can be filtered by producer',
	})
	public totalAreaHectares: number;
}
