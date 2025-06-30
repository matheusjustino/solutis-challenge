import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// DTOs
import { CultureDTO } from '../../dtos/culture.dto';
import { ResultListDTO } from '@/common/dtos/result-list.dto';

// QUERIES
import { ListCulturesQuery } from '../impl/list-cultures.query';

// REPOSITORIES
import { CultureRepository } from '../../culture.repository';

@QueryHandler(ListCulturesQuery)
export class ListCulturesHandler
	implements IQueryHandler<ListCulturesQuery, ResultListDTO<CultureDTO>>
{
	private readonly logger: Logger = new Logger(ListCulturesHandler.name);

	@Inject(CultureRepository)
	private readonly cultureRepository: CultureRepository;

	public async execute(
		query: ListCulturesQuery,
	): Promise<ResultListDTO<CultureDTO>> {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const { items, count } = await this.cultureRepository.list({
			take: query?.perPage ?? 10,
			skip: ((query?.page || 1) - 1) * (query?.perPage ?? 10),
		});

		return new ResultListDTO({
			items: items.map((item) => new CultureDTO(item)),
			total: count,
			perPage: query.perPage,
			page: query.page,
		});
	}
}
