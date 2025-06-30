import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCultureCommand extends Command<{ id: string }> {
	@ApiProperty({ type: String, description: 'Culture name' })
	@IsString()
	@IsNotEmpty()
	public name: string;
}
