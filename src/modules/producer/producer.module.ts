import { Global, Module } from '@nestjs/common';

import { ProducerController } from './producer.controller';
import { ProducerProviders } from './producer.providers';

@Global()
@Module({
	providers: ProducerProviders,
	controllers: [ProducerController],
	exports: ProducerProviders,
})
export class ProducerModule {}
