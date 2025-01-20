import { RouterProvider } from 'react-router-dom';

import { AppStateProvider } from '@src/store';
import browserRouter from './browserRouter';
import './App.css';

function App({ initialState = {} }) {
    return (
        <AppStateProvider initialState={initialState}>
            <main>
                <RouterProvider router={browserRouter} />
            </main>
        </AppStateProvider>
    );
}

export default App;
