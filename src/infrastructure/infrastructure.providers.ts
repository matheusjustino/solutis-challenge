import { Provider } from '@nestjs/common';

import { ConstantsEnum } from '@/common/consts.enum';

import { database } from './database/database-connection';

export const InfrastructureProviders: Provider[] = [
	{
		provide: ConstantsEnum.DATABASE,
		useValue: database,
	},
];
