import { Provider } from '@nestjs/common';

import { AuthRepository } from './auth.repository';
import { JwtStrategy } from './jwt-strategy';

// COMMANDS
import { CreateUserCommand } from './commands/impl/create-user.command';
import { DoLoginCommand } from './commands/impl/do-login.command';

// HANDLERS
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { DoLoginUserHandler } from './commands/handlers/do-login.handler';

export const AuthProviders: Provider[] = [
	CreateUserCommand,
	CreateUserHandler,
	DoLoginCommand,
	DoLoginUserHandler,

	AuthRepository,
	JwtStrategy,
];
