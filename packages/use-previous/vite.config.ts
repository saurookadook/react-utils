import path from 'path';
import { defineConfig } from 'vite';

const __dirname = path.resolve();

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, './index.ts'),
            name: 'usePrevious',
            // fileName: 'index',
            fileName: (format, entryName) => {
                console.log('    usePrevious    '.padStart(100, "=").padEnd(180, "="));
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

                const finalFileName = `${entryName}.${fileExtension}`;
                console.log({ finalFileName, format, entryName });
                console.log(''.padStart(180, "="));
                return finalFileName;
            },
            // name: '@saurookadook/react-utils-use-previous',
            // fileName: 'saurookadook-react-utils-use-previous',
        },
    },
});
