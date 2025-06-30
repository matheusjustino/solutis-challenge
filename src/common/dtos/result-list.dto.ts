export class ResultListDTO<T> {
	public total: number;
	public totalPages: number;
	public page: number;
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
