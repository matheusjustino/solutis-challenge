import { Provider } from '@nestjs/common';

// HANDLERS
import { GetKpisStatisticsHandler } from './queries/handlers/get-kpis-statistics.handler';
import { GetFarmsByStateStatisticsHandler } from './queries/handlers/get-farms-by-state.handler';

export const StatisticsProviders: Provider[] = [
	GetKpisStatisticsHandler,
	GetFarmsByStateStatisticsHandler,
	GetFarmsByStateStatisticsHandler,
];
