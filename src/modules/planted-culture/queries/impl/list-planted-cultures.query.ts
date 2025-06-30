import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

// DTOs
import { PaginationDTO } from '@/common/dtos/pagination.dto';

export class ListPlantedCulturesQuery extends PaginationDTO {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@IsString()
	@IsOptional()
	public producerId?: string;

	@IsOptional()
	@IsString()
	public farmId?: string;
}
