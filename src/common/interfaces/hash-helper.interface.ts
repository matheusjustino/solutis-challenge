export interface HashHelperInterface {
	hash(data: string, salt?: number): Promise<string>;
	compare(password: string, hash: string): Promise<boolean>;
}
