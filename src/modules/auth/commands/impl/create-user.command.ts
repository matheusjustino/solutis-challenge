import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserCommand extends Command<{ id: string }> {
	@ApiProperty({ type: String, description: 'User email' })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	public email: string;

	@ApiProperty({ type: String, description: 'User password' })
	@IsNotEmpty()
	@IsString()
	public password: string;
}
