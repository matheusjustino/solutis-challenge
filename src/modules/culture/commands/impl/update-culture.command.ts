import { IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';

// COMMANDS
import { CreateCultureCommand } from './create-culture.command';

export class UpdateCultureCommand extends CreateCultureCommand {
	@IsOptional()
	@Exclude()
	public cultureId: string;
}
