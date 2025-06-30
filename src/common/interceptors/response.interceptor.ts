import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

// UTILS
import { createSuccessResponse } from '../utils/response.utils';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
	public intercept(
		_: ExecutionContext,
		next: CallHandler<T>,
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(map((value) => createSuccessResponse(value)));
	}
}
