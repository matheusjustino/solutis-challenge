import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// REPOSITORIES
import { AuthRepository } from '@/modules/auth/auth.repository';

// COMMANDS
import { DoLoginCommand } from '@/modules/auth/commands/impl/do-login.command';

// USE-CASES
import { DoLoginUserHandler } from '@/modules/auth/commands/handlers/do-login.handler';

const dataMock = {
	payload: {
		email: 'matheusz_7@hotmail.com',
		password: '123',
	},
	user: {
		id: 'e8ef39a6-3526-4246-a5f9-c61f2953e473',
		email: 'matheusz_7@hotmail.com',
		password: 'hash',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	loginResponse: 'jwt-token',
};

const providersMock = {
	authRepository: {
		findByEmail: jest.fn(),
	},
	hashHelper: {
		compare: jest.fn(),
	},
	jwtHelper: {
		generateToken: jest.fn(),
	},
};

describe(DoLoginUserHandler.name, () => {
	let useCase: DoLoginUserHandler;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: AuthRepository,
					useValue: providersMock.authRepository,
				},
				{
					provide: ConstantsEnum.HASH_HELPER,
					useValue: providersMock.hashHelper,
				},
				{
					provide: ConstantsEnum.JWT_HELPER,
					useValue: providersMock.jwtHelper,
				},
				DoLoginUserHandler,
			],
		}).compile();

		useCase = module.get<DoLoginUserHandler>(DoLoginUserHandler);
	});

	test('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	test('should generate a jwt token', async () => {
		providersMock.authRepository.findByEmail.mockResolvedValueOnce(
			dataMock.user,
		);
		providersMock.hashHelper.compare.mockResolvedValueOnce(true);
		providersMock.jwtHelper.generateToken.mockResolvedValueOnce(
			dataMock.loginResponse,
		);

		const payload = new DoLoginCommand();
		Object.assign(payload, dataMock.payload);

		const token = await useCase.execute(payload);

		expect(token).toBe(dataMock.loginResponse);
	});

	test('should throw a error while finding the user', async () => {
		providersMock.authRepository.findByEmail.mockResolvedValueOnce(null);

		const payload = new DoLoginCommand();
		Object.assign(payload, dataMock.payload);

		await expect(useCase.execute(payload)).rejects.toThrow(
			new BadRequestException('Invalid credentials'),
		);
	});

	test('should throw a error while comparing passwords', async () => {
		providersMock.authRepository.findByEmail.mockResolvedValueOnce(
			dataMock.user,
		);
		providersMock.hashHelper.compare.mockResolvedValueOnce(false);

		const payload = new DoLoginCommand();
		Object.assign(payload, dataMock.payload);

		await expect(useCase.execute(payload)).rejects.toThrow(
			new BadRequestException('Invalid credentials'),
		);
	});
});
