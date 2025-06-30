import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// INTERFACES
import { UserRequestInterface } from '@/common/interfaces/user-request.interface';

// REPOSITORIES
import { AuthRepository } from './auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	@Inject(AuthRepository)
	private readonly authRepository: AuthRepository;

	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	public async validate(
		payload: UserRequestInterface,
	): Promise<UserRequestInterface> {
		const userExists = await this.authRepository.findById(payload.id);
		if (!userExists) {
			throw new UnauthorizedException('You can not perform this action');
		}

		return payload;
	}
}
