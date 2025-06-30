import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard, minutes } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { ProducerModule } from './producer/producer.module';
import { FarmModule } from './farm/farm.module';
import { CultureModule } from './culture/culture.module';
import { PlantedCultureModule } from './planted-culture/planted-culture.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				ttl: minutes(60),
				limit: 150, // 150 requests
				skipIf: () => process.env.NODE_ENV === 'dev',
			},
		]),
		AuthModule,
		ProducerModule,
		FarmModule,
		CultureModule,
		PlantedCultureModule,
		StatisticsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class ModulesModule {}
