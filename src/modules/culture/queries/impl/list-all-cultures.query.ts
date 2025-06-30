import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ListAllCulturesQuery {
	@IsOptional()
	@Exclude()
	public ownerId: string;
}
