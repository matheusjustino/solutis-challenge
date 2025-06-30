import { Global, Module } from '@nestjs/common';

import { PlantedCultureController } from './planted-culture.controller';
import { PlantedCultureProviders } from './planted-culture.providers';

@Global()
@Module({
	controllers: [PlantedCultureController],
	providers: PlantedCultureProviders,
	exports: PlantedCultureProviders,
})
export class PlantedCultureModule {}
