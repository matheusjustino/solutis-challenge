import { Provider } from '@nestjs/common';

import { ProducerRepository } from './producer.repository';

// HANDLERS
import { CreateProducerHandler } from './commands/handlers/create-producer.handler';
import { ListProducersHandler } from './queries/handlers/list-producers.handler';
import { FindByIdHandler } from './queries/handlers/find-by-id.handler';
import { UpdateProducerHandler } from './commands/handlers/update-producer.handler';
import { DeleteProducerHandler } from './commands/handlers/delete-producer.handler';
import { ListAllProducersHandler } from './queries/handlers/list-all-producers.handle';

export const ProducerProviders: Provider[] = [
	ProducerRepository,
	CreateProducerHandler,
	ListAllProducersHandler,
	ListProducersHandler,
	FindByIdHandler,
	UpdateProducerHandler,
	DeleteProducerHandler,
];
