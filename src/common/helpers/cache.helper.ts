import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

// ENUMS
import { ConstantsEnum } from '../consts.enum';

@Injectable()
export class CacheHelper {
	private readonly logger: Logger = new Logger(CacheHelper.name);
	private readonly defaultTTL: number = 1 * 60 * 5; // 5min

	@Inject(ConstantsEnum.REDIS_SERVICE)
	private readonly redis: Redis;

	public async get(key: string): Promise<string> {
		this.logger.log(`Getting from cache - key: ${key}`);
		return await this.redis.get(key);
	}

	public async set(
		key: string,
		value: string,
		ttl = this.defaultTTL,
	): Promise<string> {
		this.logger.log(
			`Setting cache - key: ${key} - value: ${value} - ttl: ${ttl}`,
		);
		return await this.redis.set(key, value, 'EX', ttl);
	}

	public async delete(...keys: string[]): Promise<number> {
		this.logger.log(`Deleting cache - keys: ${keys.join(', ')}`);
		return await this.redis.del(keys);
	}

	public async clear(): Promise<void> {
		this.logger.log(`Clearing cache`);
		await this.redis.flushall();
	}
}
