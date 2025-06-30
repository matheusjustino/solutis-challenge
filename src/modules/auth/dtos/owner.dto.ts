import { ApiProperty } from '@nestjs/swagger';

// ENTITIES
import { UserEntity } from '../entities/user.entity';

export class OwnerDTO {
	@ApiProperty({ type: String })
	public id: string;

	@ApiProperty({ type: String })
	public email: string;

	constructor(data: Partial<UserEntity>) {
		this.id = data.id;
		this.email = data.email;
	}
}
