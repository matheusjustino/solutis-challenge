module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	modulePaths: ['<rootDir>/src'],
	rootDir: '.',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	testMatch: ['<rootDir>/test/**/*.spec.ts'],
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
