import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GetStatisticsQuery {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@ApiPropertyOptional({ type: String, description: 'Producer ID' })
	@IsOptional()
	@IsString()
	public producerId?: string;
}
