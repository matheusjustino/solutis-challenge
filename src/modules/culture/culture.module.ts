import { Global, Module } from '@nestjs/common';

import { CultureController } from './culture.controller';
import { CultureProviders } from './culture.providers';

@Global()
@Module({
	controllers: [CultureController],
	providers: CultureProviders,
	exports: CultureProviders,
})
export class CultureModule {}
