import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

// DTOs
import { PaginationDTO } from '@/common/dtos/pagination.dto';

export class ListProducersQuery extends PaginationDTO {
	@IsOptional()
	@Exclude()
	public ownerId: string;
}
