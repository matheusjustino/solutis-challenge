import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ListAllFarmsQuery {
	@IsOptional()
	@Exclude()
	public ownerId: string;
}
