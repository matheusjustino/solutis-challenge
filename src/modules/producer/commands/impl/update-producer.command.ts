import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProducerCommand extends Command<{ id: string }> {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@IsOptional()
	@Exclude()
	public producerId: string;

	@ApiProperty({ type: String, description: 'User name' })
	@IsString()
	@IsNotEmpty()
	public name: string;
}
