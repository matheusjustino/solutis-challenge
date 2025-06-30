import { Global, Module } from '@nestjs/common';

import { FarmController } from './farm.controller';
import { FarmProviders } from './farm.providers';

@Global()
@Module({
	controllers: [FarmController],
	providers: FarmProviders,
	exports: FarmProviders,
})
export class FarmModule {}
