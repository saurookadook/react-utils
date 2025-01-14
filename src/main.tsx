import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from '@src/app/App';
import '@src/index.css';

try {
    const rootContainerEl = document.getElementById('root');
    const reactAppRoot = createRoot(rootContainerEl!);

    reactAppRoot.render(<App />);
} catch (e) {
    console.error(e);
}
