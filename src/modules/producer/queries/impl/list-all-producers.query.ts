import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ListAllProducers {
	@IsOptional()
	@Exclude()
	public ownerId: string;
}
