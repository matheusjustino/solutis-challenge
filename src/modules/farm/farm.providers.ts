import { Provider } from '@nestjs/common';

// REPOSITORIES
import { FarmRepository } from './farm.repository';

// HANDLERS
import { CreateFarmHandler } from './commands/handlers/create-farm.handler';
import { ListFarmsHandler } from './queries/handlers/list-farm.handler';
import { FindFarmByIdHandler } from './queries/handlers/find-farm-by-id.handler';
import { UpdateFarmHandler } from './commands/handlers/update-farm.handler';
import { DeleteFarmHandler } from './commands/handlers/delete-farm.handler';
import { ListAllFarmsHandler } from './queries/handlers/list-all-farms.handler';

export const FarmProviders: Provider[] = [
	FarmRepository,
	CreateFarmHandler,
	ListFarmsHandler,
	FindFarmByIdHandler,
	UpdateFarmHandler,
	DeleteFarmHandler,
	ListAllFarmsHandler,
];
