import path from 'path';
import { defineConfig } from 'vite';

const __dirname = path.resolve();

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, './index.ts'),
            name: 'usePrevious',
            fileName: 'index',
            // name: '@saurookadook/react-utils-use-previous',
            // fileName: 'saurookadook-react-utils-use-previous',
        },
    },
});
