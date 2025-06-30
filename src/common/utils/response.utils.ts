import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface APIResponse<T = any> {
	message: string | string[];
	timestamp: string;
	path?: string;
	data?: T;
}

export function createSuccessResponse<T>(
	data: T,
	message = 'Success',
): APIResponse {
	return {
		message,
		timestamp: new Date().toISOString(),
		data,
	};
}

export function createErrorResponse(
	message: string | string[],
	path?: string,
	data?: any,
): APIResponse {
	const formattedData =
		data && typeof data === 'object'
			? { ...data, message: undefined }
			: data;
	return {
		message,
		timestamp: new Date().toISOString(),
		path,
		data: formattedData,
	};
}

export function createApiResponse<T extends Type<any>>(
	type: T,
	isArray = false,
): Type<APIResponse<T>> {
	class ApiResponseDTO implements APIResponse<T> {
		@ApiProperty({
			type: 'string',
			example: 'Success',
			description: 'Mensagem de sucesso da resposta.',
		})
		public message: string;

		@ApiProperty({
			type: 'string',
			format: 'date-time',
			example: '2025-06-26T10:00:00.000Z',
			description: 'Timestamp da resposta.',
		})
		public timestamp: string;

		@ApiProperty({
			type: () => type,
			isArray: isArray,
			description: 'Os dados retornados pela requisição.',
		})
		public data: T;
	}

	Object.defineProperty(ApiResponseDTO, 'name', {
		writable: false,
		value: `ApiResponseOf${type.name}${isArray ? 'Array' : ''}`,
	});

	return ApiResponseDTO;
}

/**
 * Uma função factory que cria uma classe de DTO de lista paginada.
 * @param itemType - A classe do DTO que será usada para o campo 'items'.
 */
export function createResultListDTO<T extends Type<any>>(itemType: T) {
	class ResultList {
		@ApiProperty({
			type: Number,
			description: 'Total items',
			example: 100,
		})
		public total: number;

		@ApiProperty({
			type: Number,
			description: 'Total pages',
			example: 10,
		})
		public totalPages: number;

		@ApiProperty({
			type: Number,
			description: 'Current page',
			example: 1,
		})
		public page: number;

		@ApiProperty({
			isArray: true,
			type: () => itemType,
			description: 'Items list',
		})
		public items: T[];

		constructor(data: {
			items: T[];
			total: number;
			perPage: number;
			page: number;
		}) {
			this.items = data.items;
			this.total = data.total;
			this.page = data.page;
			this.totalPages = Math.ceil(data.total / data.perPage) || 1;
		}
	}

	Object.defineProperty(ResultList, 'name', {
		writable: false,
		value: `ResultList${itemType.name}DTO`,
	});

	return ResultList;
}
