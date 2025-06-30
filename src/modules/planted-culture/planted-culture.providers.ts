import { Provider } from '@nestjs/common';

// REPOSITORIES
import { PlantedCultureRepository } from './planted-culture.repository';

// HANDLERS
import { CreatePlantedCultureHandler } from './commands/handlers/create-planted-culture.handler';
import { ListPlantedCulturesHandler } from './queries/handlers/list-planted-cultures.handler';

export const PlantedCultureProviders: Provider[] = [
	PlantedCultureRepository,
	CreatePlantedCultureHandler,
	ListPlantedCulturesHandler,
];
