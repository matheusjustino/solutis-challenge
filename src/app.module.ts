import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AppController } from './app.controller';

import { InfrastructureModule } from './infrastructure/intrastructure.module';
import { CommonModule } from './common/common.module';
import { ModulesModule } from './modules/modules.module';

@Module({
	imports: [
		CqrsModule.forRoot(),
		InfrastructureModule,
		CommonModule,
		ModulesModule,
	],
	controllers: [AppController],
})
export class AppModule {}
