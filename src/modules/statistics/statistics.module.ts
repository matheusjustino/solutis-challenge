import { Module } from '@nestjs/common';

import { StatisticsController } from './statistics.controller';
import { StatisticsProviders } from './statistics.providers';

@Module({
	controllers: [StatisticsController],
	providers: StatisticsProviders,
})
export class StatisticsModule {}
