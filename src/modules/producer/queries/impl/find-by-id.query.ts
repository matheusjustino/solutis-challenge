import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class FindProducerByIdQuery {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@IsUUID()
	@IsNotEmpty()
	public producerId: string;

	constructor(data: FindProducerByIdQuery) {
		Object.assign(this, data);
	}
}
