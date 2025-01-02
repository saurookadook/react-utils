/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    coveragePathIgnorePatterns: ['/dist/', '/node_modules/', '**/*.d.ts'],
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "^.+\\.svg$": "jest-transformer-svg",
    },
    preset: "ts-jest",
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    testEnvironment: "jsdom",
    testPathIgnorePatterns: [
        ".+\.d.ts",
    ],
    transform: {
        "^.+\.(ts|tsx)$": ["ts-jest", { tsconfig: './tsconfig.json' }],
    },
};
