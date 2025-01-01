import path from 'path';
import { defineConfig } from 'vite';

const __dirname = path.resolve();

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, './lib/index.ts'),
            name: '@saurookadook/react-utils-render-with-context',
            fileName: 'saurookadook-react-utils-render-with-context',
        },
        rollupOptions: {
            external: [
                '@testing-library/react',
                '@testing-library/user-event',
                'react',
            ],
            output: {
                globals: {
                    react: 'React',
                },
            },
        },
    },
});
