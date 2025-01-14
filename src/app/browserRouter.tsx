import { createBrowserRouter } from 'react-router-dom';

import Root from '@src/layouts/Root';
import { Home, TodoList } from '@src/pages';

export const routerConfig = [
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: 'home',
                label: 'Home',
                element: <Home />,
            },
            {
                path: 'todo-list',
                label: 'To-Do List',
                element: <TodoList />,
            },
        ],
    },
];

const browserRouter = createBrowserRouter(routerConfig);

export default browserRouter;
