import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configOptions } from './app-config-options';
import { CommonProviders } from './common.providers';

@Global()
@Module({
	imports: [ConfigModule.forRoot(configOptions)],
	providers: CommonProviders,
	exports: CommonProviders,
})
export class CommonModule {}
