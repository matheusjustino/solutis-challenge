import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

// GUARDS
import { JwtGuard } from '@/common/guards/jwt.guard';

// DECORATORS
import { CurrentUser } from '@/common/decorators/user.decorator';

// INTERFACES
import { UserRequestInterface } from '@/common/interfaces/user-request.interface';

// COMMANDS
import { CreatePlantedCultureCommand } from './commands/impl/create-planted-culture.command';

// QUERIES
import { ListPlantedCulturesQuery } from './queries/impl/list-planted-cultures.query';

// UTILS
import {
	createApiResponse,
	createResultListDTO,
} from '@/common/utils/response.utils';

// DTOs
import { PlantedCultureDTO } from './dtos/planted-culture.dto';
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@UseGuards(JwtGuard)
@ApiTags(`[PLANTED-CULTURE]`)
@Controller('planted-culture')
export class PlantedCultureController {
	@Inject(CommandBus)
	private readonly commandBus: CommandBus;
	@Inject(QueryBus)
	private readonly queryBus: QueryBus;

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: CreatePlantedCultureCommand })
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async createPlantedCulture(
		@CurrentUser() user: UserRequestInterface,
		@Body() body: CreatePlantedCultureCommand,
	) {
		body.ownerId = user.id;
		return this.commandBus.execute(body);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createResultListDTO(PlantedCultureDTO) })
	public async listPlantedCultures(
		@CurrentUser() user: UserRequestInterface,
		@Query() query: ListPlantedCulturesQuery,
	) {
		query.ownerId = user.id;
		return this.queryBus.execute(query);
	}
}
