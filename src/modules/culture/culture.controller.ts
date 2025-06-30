import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// GUARDS
import { JwtGuard } from '@/common/guards/jwt.guard';

// UTILS
import {
	createApiResponse,
	createResultListDTO,
} from '@/common/utils/response.utils';

// COMMANDS
import { CreateCultureCommand } from './commands/impl/create-culture.command';

// QUERIES
import { ListCulturesQuery } from './queries/impl/list-cultures.query';
import { UpdateCultureCommand } from './commands/impl/update-culture.command';
import { ListAllCulturesQuery } from './queries/impl/list-all-cultures.query';

// INTERFACES
import { UserRequestInterface } from '@/common/interfaces/user-request.interface';

// DTOs
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';
import { CultureDTO } from './dtos/culture.dto';
import { CurrentUser } from '@/common/decorators/user.decorator';

@UseGuards(JwtGuard)
@ApiTags(`[CULTURE]`)
@Controller('culture')
export class CultureController {
	@Inject(CommandBus)
	private readonly commandBus: CommandBus;
	@Inject(QueryBus)
	private readonly queryBus: QueryBus;

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: CreateCultureCommand })
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async createCulture(@Body() body: CreateCultureCommand) {
		return this.commandBus.execute(body);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createResultListDTO(CultureDTO) })
	public async listCultures(@Query() query: ListCulturesQuery) {
		return this.queryBus.execute(query);
	}

	@Get('all')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: [CultureDTO] })
	public async listAllCultures(
		@CurrentUser() user: UserRequestInterface,
		@Query() query: ListAllCulturesQuery,
	) {
		query.ownerId = user.id;
		return this.queryBus.execute(query);
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: UpdateCultureCommand })
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async updateCulture(
		@Param('id') cultureId: string,
		@Body() body: UpdateCultureCommand,
	) {
		body.cultureId = cultureId;
		return this.commandBus.execute(body);
	}
}
