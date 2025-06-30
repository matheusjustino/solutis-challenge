import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

// ENUMS
import { ConstantsEnum } from '@/common/consts.enum';

// HANDLERS
import { CreateProducerHandler } from '@/modules/producer/commands/handlers/create-producer.handler';

// COMMANDS
import { CreateProducerCommand } from '@/modules/producer/commands/impl/create-producer.command';

// REPOSITORIES
import { ProducerRepository } from '@/modules/producer/producer.repository';

const dataMock = {
	payload: {
		ownerId: 'ownerId',
		document: '68923524050',
		name: 'producer',
	},
	createdProducer: {
		id: 'id',
	},
};

const providersMock = {
	producerRepository: {
		create: jest.fn(),
	},
	cacheHelper: {
		clear: jest.fn(),
	},
};

describe(CreateProducerHandler.name, () => {
	let handler: CreateProducerHandler;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: ProducerRepository,
					useValue: providersMock.producerRepository,
				},
				{
					provide: ConstantsEnum.CACHE_HELPER,
					useValue: providersMock.cacheHelper,
				},
				CreateProducerHandler,
			],
		}).compile();

		handler = module.get<CreateProducerHandler>(CreateProducerHandler);
	});

	test('should be defined', () => {
		expect(handler).toBeDefined();
	});

	test(`should create a new producer`, async () => {
		providersMock.producerRepository.create.mockResolvedValueOnce(
			dataMock.createdProducer,
		);

		const payload = new CreateProducerCommand();
		Object.assign(payload, dataMock.payload);

		const newProducer = await handler.execute(payload);

		expect(newProducer.id).toBe('id');
	});

	test(`should throw an error while creating a producer`, async () => {
		providersMock.producerRepository.create.mockRejectedValueOnce({
			code: 'P2002',
		});

		const payload = new CreateProducerCommand();
		Object.assign(payload, dataMock.payload);

		await expect(handler.execute(payload)).rejects.toThrow(
			new BadRequestException(
				'A new producer cannot be created with this document',
			),
		);
	});
});
