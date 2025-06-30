import { Global, Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthProviders } from './auth.providers';

@Global()
@Module({
	controllers: [AuthController],
	providers: AuthProviders,
	exports: AuthProviders,
})
export class AuthModule {}
