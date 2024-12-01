/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    coveragePathIgnorePatterns: ['/dist/', '/node_modules/', '**/*.d.ts'],
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "^.+\\.svg$": "jest-transformer-svg",
    },
    // setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    // testEnvironment: "jsdom",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
};
