import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConstantsEnum } from './consts.enum';

import { HashHelper } from './helpers/hash.helper';
import { JwtHelper } from './helpers/jwt.helper';
import { JwtGuard } from './guards/jwt.guard';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { CacheHelper } from './helpers/cache.helper';
import { RedisClientFactory } from './configs/redis-connection.config';

export const CommonProviders: Provider[] = [
	{
		provide: ConstantsEnum.HASH_HELPER,
		useClass: HashHelper,
	},
	{
		provide: ConstantsEnum.JWT_HELPER,
		useClass: JwtHelper,
	},
	{
		provide: ConstantsEnum.AUTH_GUARD,
		useClass: JwtGuard,
	},
	{
		provide: ConstantsEnum.JWT_SERVICE,
		useClass: JwtService,
	},
	{
		provide: ConstantsEnum.CACHE_HELPER,
		useClass: CacheHelper,
	},
	RedisClientFactory,
	AllExceptionsFilter,
	LoggingInterceptor,
	ResponseInterceptor,
];
