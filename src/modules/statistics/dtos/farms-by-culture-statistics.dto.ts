import { ApiProperty } from '@nestjs/swagger';

export class FarmsByCultureStatisticsDTO {
	@ApiProperty({ type: String, description: 'Name of the culture' })
	public name: string;

	@ApiProperty({ type: Number, description: 'Number of farms' })
	public count: number;
}
