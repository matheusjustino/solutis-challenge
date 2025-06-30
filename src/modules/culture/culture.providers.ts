import { Provider } from '@nestjs/common';

// REPOSITORIES
import { CultureRepository } from './culture.repository';

// HANDLERS
import { CreateCultureHandler } from './commands/handlers/create-culture.handler';
import { ListCulturesHandler } from './queries/handlers/list-cultures.handler';
import { UpdateCultureHandler } from './commands/handlers/update-culture.handler';
import { ListAllCulturesHandler } from './queries/handlers/list-all-cultures.handler';

export const CultureProviders: Provider[] = [
	CultureRepository,
	CreateCultureHandler,
	ListCulturesHandler,
	UpdateCultureHandler,
	ListAllCulturesHandler,
];
