import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';

// GUARDS
import { JwtGuard } from '@/common/guards/jwt.guard';

// DECORATORS
import { CurrentUser } from '@/common/decorators/user.decorator';

// INTERFACES
import { UserRequestInterface } from '@/common/interfaces/user-request.interface';

// UTILS
import { createApiResponse } from '@/common/utils/response.utils';

// DTOs
import { KpisStatisticsDTO } from './dtos/kpis-statistics.dto';
import { FarmsByStatisticsDTO } from './dtos/farms-by-statistics.dto';

// QUERIES
import { GetKpisStatisticsQuery } from './queries/impl/get-kpis-statistics.query';
import { GetFarmsByStateStatisticsQuery } from './queries/impl/get-farms-by-state.query';

@UseGuards(JwtGuard)
@ApiTags(`[STATISTICS]`)
@Controller('statistics')
export class StatisticsController {
	@Inject(QueryBus)
	private readonly queryBus: QueryBus;

	@Get('kpis')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: KpisStatisticsDTO })
	public async getKpis(
		@CurrentUser() user: UserRequestInterface,
		@Query() query: GetKpisStatisticsQuery,
	) {
		query.ownerId = user.id;
		return this.queryBus.execute<GetKpisStatisticsQuery, KpisStatisticsDTO>(
			query,
		);
	}

	@Get('farms-by')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: createApiResponse(FarmsByStatisticsDTO) })
	public async getFarmsByState(
		@CurrentUser() user: UserRequestInterface,
		@Query() query: GetFarmsByStateStatisticsQuery,
	) {
		query.ownerId = user.id;
		return this.queryBus.execute<
			GetFarmsByStateStatisticsQuery,
			FarmsByStatisticsDTO
		>(query);
	}
}
