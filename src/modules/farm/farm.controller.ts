import {
	Body,
	Controller,
	Delete,
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

// DECORATORS
import { CurrentUser } from '@/common/decorators/user.decorator';

// INTERFACES
import { UserRequestInterface } from '@/common/interfaces/user-request.interface';

// COMMANDS
import { CreateFarmCommand } from './commands/impl/create-farm.command';
import { UpdateFarmCommand } from './commands/impl/update-farm.command';
import { DeleteFarmCommand } from './commands/impl/delete-farm.command';

// QUERIES
import { ListAllFarmsQuery } from './queries/impl/list-all-farms.query';
import { FindFarmByIdQuery } from './queries/impl/find-farm-by-id.query';
import { ListFarmsQuery } from './queries/impl/list-farms.query';

// UTILS
import {
	createApiResponse,
	createResultListDTO,
} from '@/common/utils/response.utils';

// DTOs
import { FarmDTO } from './dtos/farm.dto';
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@UseGuards(JwtGuard)
@ApiTags(`[FARM]`)
@Controller('farm')
export class FarmController {
	@Inject(CommandBus)
	private readonly commandBus: CommandBus;
	@Inject(QueryBus)
	private readonly queryBus: QueryBus;

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: CreateFarmCommand })
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async createFarm(
		@CurrentUser() user: UserRequestInterface,
		@Body() body: CreateFarmCommand,
	) {
		body.ownerId = user.id;
		return this.commandBus.execute(body);
	}

	@Get('all')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: [FarmDTO] })
	public async listAllFarms(
		@CurrentUser() user: UserRequestInterface,
		@Query() query: ListAllFarmsQuery,
	) {
		query.ownerId = user.id;
		return this.queryBus.execute(query);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createResultListDTO(FarmDTO) })
	public async listFarms(
		@CurrentUser() user: UserRequestInterface,
		@Query() query: ListFarmsQuery,
	) {
		query.ownerId = user.id;
		return this.queryBus.execute(query);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createApiResponse(FarmDTO) })
	public async findFarmById(
		@CurrentUser() user: UserRequestInterface,
		@Param('id') farmId: string,
		@Query() query: FindFarmByIdQuery,
	) {
		Object.assign(query, {
			ownerId: user.id,
			farmId,
		});
		return this.queryBus.execute(query);
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async updateFarm(
		@CurrentUser() user: UserRequestInterface,
		@Param('id') farmId: string,
		@Body() body: UpdateFarmCommand,
	) {
		Object.assign(body, {
			ownerId: user.id,
			farmId,
		});
		return this.commandBus.execute(body);
	}

	@Delete(':id/producer/:producerId')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async deleteFarm(
		@CurrentUser() user: UserRequestInterface,
		@Param('id') farmId: string,
		@Param('producerId') producerId: string,
	) {
		const payload = new DeleteFarmCommand();
		Object.assign(payload, {
			ownerId: user.id,
			farmId,
			producerId,
		});
		return this.commandBus.execute(payload);
	}
}
