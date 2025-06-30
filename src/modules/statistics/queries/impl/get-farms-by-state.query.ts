import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// ENUMS
import { GetFarmsByFilterEnum } from '../../enums/get-farms-by-filter.enum';

// QUERIES
import { GetStatisticsQuery } from '@/common/queries/impl/get-statistics.query';

export class GetFarmsByStateStatisticsQuery extends GetStatisticsQuery {
	@ApiPropertyOptional({
		type: String,
		default: GetFarmsByFilterEnum.STATE,
		example: `${GetFarmsByFilterEnum.STATE};${GetFarmsByFilterEnum.CULTURE}`,
	})
	@IsOptional()
	@IsEnum(GetFarmsByFilterEnum, {
		each: true,
		message: `Each value in 'by' must be one of the following: ${Object.values(GetFarmsByFilterEnum).join(', ')}`,
	})
	@Transform(({ value }: { value?: string }) => {
		if (!value || value.trim() === '') return [GetFarmsByFilterEnum.STATE];

		const validationRegex = /^[a-zA-Z]+(;[a-zA-Z]+)*$/;
		if (!validationRegex.test(value)) {
			throw new BadRequestException(
				'Invalid format. Filters must be letters, separated by a single semicolon (;) with no spaces or trailing semicolons.',
			);
		}

		const filters = value.split(';').map((item) => {
			const trimmedItem = item.trim();
			return trimmedItem as GetFarmsByFilterEnum;
		});
		const validFilters = Object.values(GetFarmsByFilterEnum);
		for (const filter of filters) {
			if (!validFilters.includes(filter)) {
				throw new BadRequestException(
					`Invalid filter value: '${filter}'. Valid options are: ${validFilters.join(', ')}.`,
				);
			}
		}

		return filters;
	})
	public by?: [
		| GetFarmsByFilterEnum.STATE
		| GetFarmsByFilterEnum.CULTURE
		| GetFarmsByFilterEnum.LAND,
	] = [GetFarmsByFilterEnum.STATE];
}
