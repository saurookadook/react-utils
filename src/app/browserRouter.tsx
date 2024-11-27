import { createBrowserRouter } from 'react-router-dom';

import Root from '@src/layouts/Root';
import { Home } from '@src/pages';

export const routerConfig = [
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: 'home',
                element: <Home />,
            },
        ],
    },
];

const browserRouter = createBrowserRouter(routerConfig);

export default browserRouter;
