import { Command } from '@nestjs/cqrs';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class DeleteProducerCommand extends Command<{ id: string }> {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@IsOptional()
	@Exclude()
	public producerId: string;
}
