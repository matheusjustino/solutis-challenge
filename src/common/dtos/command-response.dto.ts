import { ApiProperty } from '@nestjs/swagger';

export class CreateCommandDTO {
	@ApiProperty({ type: String, description: 'Resource ID' })
	public id: string;
}
