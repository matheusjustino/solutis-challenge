import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ENTITIES
import { UserEntity } from '../entities/user.entity';

// DTOs
import { ProducerDTO } from '@/modules/producer/dtos/producer.dto';

export class UserDTO {
	@ApiProperty({ type: String, description: 'User ID' })
	public id: string;

	@ApiProperty({ type: String, description: 'User email' })
	public email: string;

	@ApiPropertyOptional({ type: [ProducerDTO], description: 'User producers' })
	public producers?: ProducerDTO[];

	@ApiProperty({ type: Date, description: 'User create date' })
	public createdAt: Date;

	@ApiProperty({ type: Date, description: 'User update date' })
	public updatedAt: Date;

	constructor(data: Partial<UserEntity>) {
		Object.assign(this, {
			...data,
			producers: data.producers
				? data.producers.map((producer) => new ProducerDTO(producer))
				: [],
		});
	}
}
