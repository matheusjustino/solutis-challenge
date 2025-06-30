import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { FarmState } from '@prisma/client';

export class CreateFarmCommand extends Command<{ id: string }> {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@ApiProperty({ type: String, description: 'Producer ID' })
	@IsString()
	@IsNotEmpty()
	public producerId: string;

	@ApiProperty({ type: String, description: 'Farm name' })
	@IsString()
	@IsNotEmpty()
	public name: string;

	@ApiProperty({ type: String, description: 'Farm city' })
	@IsString()
	@IsNotEmpty()
	public city: string;

	@ApiProperty({ enum: FarmState, description: 'Farm state' })
	@IsEnum(FarmState)
	@IsNotEmpty()
	public state: FarmState;

	@ApiProperty({ type: Number, description: 'Total area' })
	@IsNumber()
	@IsNotEmpty()
	public totalAreaHectares: number;

	@ApiProperty({ type: Number, description: 'Arable area' })
	@IsNumber()
	@IsNotEmpty()
	public arableAreaHectares: number;

	@ApiProperty({ type: Number, description: 'Vegetation area' })
	@IsNumber()
	@IsNotEmpty()
	public vegetationAreaHectares: number;
}
