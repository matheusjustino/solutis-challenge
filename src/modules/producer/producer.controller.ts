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
import { CreateProducerCommand } from './commands/impl/create-producer.command';
import { UpdateProducerCommand } from './commands/impl/update-producer.command';

// QUERIES
import { ListProducersQuery } from './queries/impl/list-producers.query';
import { ListAllProducers } from './queries/impl/list-all-producers.query';
import { FindProducerByIdQuery } from './queries/impl/find-by-id.query';
import { DeleteProducerCommand } from './commands/impl/delete-producer.command';

// UTILS
import {
	createApiResponse,
	createResultListDTO,
} from '@/common/utils/response.utils';

// DTOs
import { ProducerDTO } from './dtos/producer.dto';
import { CreateCommandDTO } from '@/common/dtos/command-response.dto';

@UseGuards(JwtGuard)
@ApiTags(`[PRODUCER]`)
@Controller('producer')
export class ProducerController {
	@Inject(CommandBus)
	private readonly commandBus: CommandBus;
	@Inject(QueryBus)
	private readonly queryBus: QueryBus;

	@Get('all')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: [ProducerDTO] })
	public async listAllProducers(
		@CurrentUser() user: UserRequestInterface,
		@Query() query: ListAllProducers,
	) {
		query.ownerId = user.id;
		return this.queryBus.execute(query);
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: CreateProducerCommand })
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async createProducer(
		@CurrentUser() user: UserRequestInterface,
		@Body() body: CreateProducerCommand,
	) {
		body.ownerId = user.id;
		return this.commandBus.execute(body);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createResultListDTO(ProducerDTO) })
	public async listProducers(
		@CurrentUser() user: UserRequestInterface,
		@Query() query: ListProducersQuery,
	) {
		query.ownerId = user.id;
		return this.queryBus.execute(query);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createApiResponse(ProducerDTO) })
	public async findById(
		@CurrentUser() user: UserRequestInterface,
		@Param('id') id: string,
	) {
		const query = new FindProducerByIdQuery({
			ownerId: user.id,
			producerId: id,
		});

		return this.queryBus.execute(query);
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async update(
		@CurrentUser() user: UserRequestInterface,
		@Param('id') producerId: string,
		@Body() body: UpdateProducerCommand,
	) {
		Object.assign(body, {
			ownerId: user.id,
			producerId,
		});

		return this.commandBus.execute(body);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createApiResponse(CreateCommandDTO) })
	public async delete(
		@CurrentUser() user: UserRequestInterface,
		@Param('id') producerId: string,
	) {
		const deletePayload = new DeleteProducerCommand();
		Object.assign(deletePayload, {
			ownerId: user.id,
			producerId,
		});

		return this.commandBus.execute(deletePayload);
	}
}
