import { ApiProperty } from '@nestjs/swagger';

export class FarmsByStateStatisticsDTO {
	@ApiProperty({ type: String, description: 'Farm state' })
	public state: string;

	@ApiProperty({ type: Number, description: 'Quantity of farms by state' })
	public count: number;
}
