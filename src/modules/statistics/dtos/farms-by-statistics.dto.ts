import { ApiProperty } from '@nestjs/swagger';

// DTOs
import { FarmsByStateStatisticsDTO } from './farms-by-state-statistics.dto';
import { FarmsByLandUseStatisticsDTO } from './farms-by-land-use-statistics.dto';
import { FarmsByCultureStatisticsDTO } from './farms-by-culture-statistics.dto';

export class FarmsByStatisticsDTO {
	@ApiProperty({
		type: [FarmsByStateStatisticsDTO],
		description: 'Statistics by state',
	})
	public byState: FarmsByStateStatisticsDTO[];

	@ApiProperty({
		type: [FarmsByCultureStatisticsDTO],
		description: 'Statistics by culture',
	})
	public byCulture: FarmsByCultureStatisticsDTO[];

	@ApiProperty({
		type: [FarmsByLandUseStatisticsDTO],
		description: 'Statistics by land use',
	})
	public byLandUse: FarmsByLandUseStatisticsDTO[];
}
