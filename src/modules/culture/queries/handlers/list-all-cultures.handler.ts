import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// QUERIES
import { ListAllCulturesQuery } from '../impl/list-all-cultures.query';

// DTOs
import { CultureDTO } from '../../dtos/culture.dto';

// REPOSITORIES
import { CultureRepository } from '../../culture.repository';

@QueryHandler(ListAllCulturesQuery)
export class ListAllCulturesHandler
	implements IQueryHandler<ListAllCulturesHandler, CultureDTO[]>
{
	private readonly logger: Logger = new Logger(ListAllCulturesHandler.name);

	@Inject(CultureRepository)
	private readonly cultureRepository: CultureRepository;

	public async execute(query: ListAllCulturesHandler): Promise<CultureDTO[]> {
		this.logger.log(
			`Executing... query: ${JSON.stringify(query, null, 4)}`,
		);

		const cultures = await this.cultureRepository.listAll();
		return cultures.map((culture) => new CultureDTO(culture));
	}
}
