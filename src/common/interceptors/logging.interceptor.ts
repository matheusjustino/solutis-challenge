import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name);

	public intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<any> {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest<Request>();
		const response = httpContext.getResponse<Response>();
		const { method, originalUrl, ip } = request;
		const userAgent = request.get('user-agent') || '';
		const now = Date.now();

		this.logger.log(
			`[${method} ${originalUrl}] Request received - IP: ${ip} - UserAgent: ${userAgent}`,
		);

		return next.handle().pipe(
			tap(() => {
				const delay = Date.now() - now;
				this.logger.log(
					`[${method} ${originalUrl}] Request completed - Status: ${response.statusCode} - Duration: ${delay}ms`,
				);
			}),
			catchError((err) => {
				const delay = Date.now() - now;
				this.logger.error(
					`[${method} ${originalUrl}] Request failed - Status: ${err.status || response.statusCode || 500} - Duration: ${delay}ms - Error: ${err.message}`,
					err.stack,
				);
				throw err;
			}),
		);
	}
}
