import { Command } from '@nestjs/cqrs';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { FarmState } from '@prisma/client';

export class UpdateFarmCommand extends Command<{ id: string }> {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@IsOptional()
	@Exclude()
	public farmId: string;

	@ApiProperty({ type: String, description: 'Producer ID' })
	@IsString()
	@IsNotEmpty()
	public producerId: string;

	@ApiProperty({ type: String, description: 'Producer ID' })
	@IsString()
	@IsOptional()
	public name?: string;

	@ApiPropertyOptional({ type: String, description: 'Farm city' })
	@IsString()
	@IsOptional()
	public city?: string;

	@ApiProperty({ enum: FarmState, description: 'Farm state' })
	@IsEnum(FarmState)
	@IsOptional()
	public state: FarmState;

	@ApiPropertyOptional({ type: Number, description: 'Total area' })
	@IsNumber()
	@IsOptional()
	public totalAreaHectares?: number;

	@ApiPropertyOptional({ type: Number, description: 'Arable area' })
	@IsNumber()
	@IsOptional()
	public arableAreaHectares?: number;

	@ApiPropertyOptional({ type: Number, description: 'Vegetation area' })
	@IsNumber()
	@IsOptional()
	public vegetationAreaHectares?: number;
}
