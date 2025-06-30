import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

// UTILS
import { createApiResponse } from '@/common/utils/response.utils';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

// COMMANDS
import { CreateUserCommand } from './commands/impl/create-user.command';
import { DoLoginCommand } from './commands/impl/do-login.command';

@ApiTags(`[AUTH]`)
@Controller('auth')
export class AuthController {
	@Inject(CommandBus)
	private readonly commandBus: CommandBus;

	@Post('register')
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: CreateUserCommand })
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async register(@Body() body: CreateUserCommand) {
		return this.commandBus.execute(body);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: DoLoginCommand })
	@ApiOkResponse({ type: createApiResponse(String) })
	public async doLogin(@Body() body: DoLoginCommand) {
		return this.commandBus.execute(body);
	}
}
