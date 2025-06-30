import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlantedCultureCommand extends Command<{ id: string }> {
	@IsOptional()
	@Exclude()
	public ownerId: string;

	@ApiProperty({ type: String, description: 'Farm ID' })
	@IsString()
	@IsNotEmpty()
	public farmId: string;

	@ApiProperty({ type: String, description: 'Producer ID' })
	@IsString()
	@IsNotEmpty()
	public producerId: string;

	@ApiProperty({ type: String, description: 'Culture ID' })
	@IsString()
	@IsNotEmpty()
	public cultureId: string;

	@ApiProperty({ type: String, description: 'Harvest name' })
	@IsString()
	@IsNotEmpty()
	public harvestName: string;
}
