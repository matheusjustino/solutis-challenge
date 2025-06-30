import { Global, Module } from '@nestjs/common';

import { InfrastructureProviders } from './infrastructure.providers';

@Global()
@Module({
	providers: InfrastructureProviders,
	exports: InfrastructureProviders,
})
export class InfrastructureModule {}
