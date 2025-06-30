import { BadRequestException } from '@nestjs/common';
import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// HELPERS
import { isValidDocument } from '@/common/helpers/validate-document.helper';

export class CreateProducerCommand extends Command<{ id: string }> {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@ApiProperty({ type: String, description: 'User document (CPF or CNPJ)' })
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }: { value: string }) => {
		if (!isValidDocument(value)) {
			throw new BadRequestException('Invalid Document');
		}
		return value;
	})
	public document: string;

	@ApiProperty({ type: String, description: 'User name' })
	@IsNotEmpty()
	@IsString()
	public name: string;
}
