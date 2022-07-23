import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './home';
import { Sharing } from './sharing';
import { Summary } from './summary';

interface IPageConfig {
    path: string;
    element: JSX.Element;
}

const PAGE_CONFIGS: IPageConfig[] = [
    {
        path: '/sharing',
        element: <Sharing />,
    },
    {
        path: '/summary',
        element: <Summary />
    },
    {
        path: '/',
        element: <Home />
    },
];

export const Router = () => (
    <BrowserRouter>
        <Routes>
            {PAGE_CONFIGS.map(({path, element}) => (<Route path={path} element={element} key={`page-${path}`} />))}
        </Routes>
    </BrowserRouter>
);
