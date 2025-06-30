import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(`[APP]`)
@Controller()
export class AppController {
	@Get()
	@ApiOkResponse({
		type: String,
	})
	public healthCheck(): string {
		return `Server is ON!`;
	}
}
