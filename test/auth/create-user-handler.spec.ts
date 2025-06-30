import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// REPOSITORIES
import { AuthRepository } from '@/modules/auth/auth.repository';

// HANDLERS
import { CreateUserHandler } from '@/modules/auth/commands/handlers/create-user.handler';

// COMMANDS
import { CreateUserCommand } from '@/modules/auth/commands/impl/create-user.command';

const dataMock = {
	payload: {
		email: 'matheusz_7@hotmail.com',
		password: '123',
	},
	createdUser: {
		id: 'e8ef39a6-3526-4246-a5f9-c61f2953e473',
		email: 'matheusz_7@hotmail.com',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
};

const providersMock = {
	authRepository: {
		create: jest.fn(),
	},
	hashHelper: {
		hash: jest.fn(),
	},
};

describe(CreateUserHandler.name, () => {
	let useCase: CreateUserHandler;

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
				CreateUserHandler,
			],
		}).compile();

		useCase = module.get<CreateUserHandler>(CreateUserHandler);
	});

	test('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	test('Should create a new user', async () => {
		providersMock.authRepository.create.mockResolvedValueOnce(
			dataMock.createdUser,
		);

		const payload = new CreateUserCommand();
		Object.assign(payload, dataMock.payload);

		const newUser = await useCase.execute(payload);

		expect(newUser.id).toBe(dataMock.createdUser.id);
	});

	test('Should throw an error while creating a user', async () => {
		providersMock.authRepository.create.mockRejectedValueOnce({
			code: 'P2002',
		});

		const payload = new CreateUserCommand();
		Object.assign(payload, dataMock.payload);

		await expect(useCase.execute(payload)).rejects.toThrow(
			new BadRequestException(
				'A new user cannot be created with this email',
			),
		);
	});
});
