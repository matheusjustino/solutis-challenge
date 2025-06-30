import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindFarmByIdQuery {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@IsOptional()
	@Exclude()
	public farmId: string;

	@IsString()
	@IsNotEmpty()
	public producerId: string;
}
