import {
	Logger,
	FactoryProvider,
	InternalServerErrorException,
} from '@nestjs/common';
import { Redis } from 'ioredis';

// ENUMS
import { ConstantsEnum } from '../consts.enum';

export const RedisClientFactory: FactoryProvider<Redis> = {
	provide: ConstantsEnum.REDIS_SERVICE,
	useFactory: () => {
		const logger = new Logger('RedisModule');

		return new Promise((resolve, reject) => {
			const redisInstance = new Redis({
				host: process.env.REDIS_HOST,
				port: +process.env.REDIS_PORT,
				password: process.env.REDIS_PASSWORD,
				retryStrategy: (times) => {
					const delay = Math.min(times * 50, 2000);
					return delay;
				},
			});

			redisInstance.on('ready', () => {
				logger.log('Redis is ready and connected successfully!');
				resolve(redisInstance);
			});

			redisInstance.on('error', (e) => {
				logger.error('Unable to connect to Redis', e);
				reject(
					new InternalServerErrorException(
						`Redis connection failed: ${e.message}`,
					),
				);
			});
		});
	},
	inject: [],
};
