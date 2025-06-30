import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationDTO {
	@ApiProperty({ type: Number, description: 'Items per page' })
	@IsNumber()
	@Min(1)
	@Transform(({ value }) => Number(value))
	public perPage: number = 10;

	@ApiProperty({ type: Number, description: 'Current page' })
	@Min(0)
	@Transform(({ value }) => Number(value) || 1)
	public page: number = 1;
}
