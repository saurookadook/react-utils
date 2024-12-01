import path from 'path';
import { defineConfig } from 'vite';

const __dirname = path.resolve();

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, './index.ts'),
            // name: 'combineReducers'
            name: '@saurookadook/react-utils-combine-reducers',
            fileName: 'saurookadook-react-utils-combine-reducers',
        },
        rollupOptions: {
            external: ['react'],
            output: {
                globals: {
                    react: 'React',
                },
            },
        },
    },
});
