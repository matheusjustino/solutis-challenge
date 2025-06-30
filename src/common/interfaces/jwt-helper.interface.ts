export interface JwtHelperInterface {
	generateToken(payload: { id: string }): string;
}
