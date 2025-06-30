import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTOs
import { UserDTO } from '@/modules/auth/dtos/user.dto';
import { FarmDTO } from '@/modules/farm/dtos/farm.dto';

// ENTITIES
import { ProducerEntity } from '../entities/producer.entity';

export class ProducerDTO {
	@ApiProperty({ type: String })
	public id: string;

	@ApiProperty({ type: String })
	public document: string;

	@ApiProperty({ type: String })
	public name: string;

	@ApiProperty({ type: String })
	public ownerId: string;

	@ApiPropertyOptional({ type: () => UserDTO })
	public owner?: Partial<UserDTO>;

	@ApiPropertyOptional({ type: () => [FarmDTO] })
	public farms?: Partial<FarmDTO>[];

	@ApiProperty({ type: Date })
	public createdAt: Date;

	@ApiProperty({ type: Date })
	public updatedAt: Date;

	constructor(data: Partial<ProducerEntity>) {
		Object.assign(this, {
			...data,
			owner: data?.owner ? new UserDTO(data.owner) : null,
			farms: data?.farms
				? data.farms.map((farm) => new FarmDTO(farm))
				: [],
		});
	}
}
