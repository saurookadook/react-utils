import path from 'path';
import { defineConfig } from 'vite';
import typescript from 'rollup-plugin-typescript2';
import dts from 'vite-plugin-dts';

const __dirname = path.resolve();

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, './src/index.ts'),
            name: 'combineReducers',
            fileName: (format, entryName) => {
                const trimmedEntryName = entryName.replace(/\.\w+?$/gim, '');
                console.log('    combineReducers    '.padStart(100, "=").padEnd(180, "="));
                console.log({ format, entryName });
                let fileExtension = 'js';
                switch (format) {
                    case 'es':
                        fileExtension = 'mjs';
                        break;
                    case 'cjs':
                        fileExtension = 'cjs';
                        break;
                    case 'umd':
                        fileExtension = 'umd.js';
                        break;
                }

                const finalFileName = `${trimmedEntryName}.${fileExtension}`;
                console.log({ finalFileName, format, entryName, trimmedEntryName });
                console.log(''.padStart(180, "="));
                return finalFileName;
            },
            // name: '@saurookadook/react-utils-combine-reducers',
            // fileName: 'saurookadook-react-utils-combine-reducers',
        },
        rollupOptions: {
            external: ['react'],
            output: {
                exports: 'named',
                globals: {
                    react: 'React',
                },
            },
            plugins: [
                typescript({
                    // check: true,
                    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
                    // tsconfigOverride: {
                    //     compilerOptions: {
                    //         declaration: true,
                    //         declarationMap: true,
                    //         sourceMap: false,
                    //     },
                    //     exclude: ['**/__tests__'],
                    // },
                    useTsconfigDeclarationDir: true,
                }),
            ],
        },
    },
    plugins: [dts({ include: 'src' })],
});
