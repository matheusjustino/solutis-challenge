import { Test, TestingModule } from '@nestjs/testing';

// DTOs
import { ResultListDTO } from '@/common/dtos/result-list.dto';

// ENTITIES
import { ProducerEntity } from '@/modules/producer/entities/producer.entity';

// REPOSITORIES
import { ProducerRepository } from '@/modules/producer/producer.repository';

// HANDLERS
import { ListProducersHandler } from '@/modules/producer/queries/handlers/list-producers.handler';

// QUERIES
import { ListProducersQuery } from '@/modules/producer/queries/impl/list-producers.query';

const dataMock = {
	query: {
		ownerId: 'ownerId',
		page: 1,
		totalPages: 10,
	},
	producersList: [
		{
			id: '1',
		},
		{
			id: '2',
		},
	],
};

const providersMock = {
	producerRepository: {
		list: jest.fn(),
	},
};

describe(ListProducersHandler.name, () => {
	let handler: ListProducersHandler;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: ProducerRepository,
					useValue: providersMock.producerRepository,
				},
				ListProducersHandler,
			],
		}).compile();

		handler = module.get<ListProducersHandler>(ListProducersHandler);
	});

	test('should be defined', () => {
		expect(handler).toBeDefined();
	});

	test('Should return paginated producers list', async () => {
		providersMock.producerRepository.list.mockResolvedValueOnce({
			items: dataMock.producersList,
			count: dataMock.producersList.length,
		});

		const query = new ListProducersQuery();
		Object.assign(query, dataMock.query);

		const producers = await handler.execute(query);

		expect(producers).toBeInstanceOf(ResultListDTO);
		expect(producers).toMatchObject({
			items: expect.any(Array<ProducerEntity>),
			total: expect.any(Number),
			page: expect.any(Number),
			totalPages: expect.any(Number),
		});
		producers.items.forEach((item, idx) =>
			expect(item.id).toBe(String(idx + 1)),
		);
	});
});
