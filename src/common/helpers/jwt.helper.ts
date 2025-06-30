import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// ENUMS
import { ConstantsEnum } from '../consts.enum';

// INTERFACES
import { JwtHelperInterface } from '../interfaces/jwt-helper.interface';

@Injectable()
export class JwtHelper implements JwtHelperInterface {
	private readonly logger: Logger = new Logger(JwtHelper.name);

	@Inject(ConstantsEnum.JWT_SERVICE)
	private readonly jwtService: JwtService;

	public generateToken(payload: { id: string }): string {
		this.logger.log(`Generating JWT token...`);

		const tokenPayload = {
			id: payload.id,
		};

		return this.jwtService.sign(tokenPayload, {
			secret: process.env.JWT_SECRET,
			expiresIn: '12h',
		});
	}
}
