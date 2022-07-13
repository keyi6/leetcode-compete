import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './home';

interface IPageConfig {
    path: string;
    element: JSX.Element;
}

const PAGE_CONFIGS: IPageConfig[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/stats',
        // TODO: build stats page
        element: <p>stats</p>,
    }
];

export const Router = () => (
    <BrowserRouter>
        <Routes>
            {PAGE_CONFIGS.map(({path, element}) => (<Route path={path} element={element} key={`page-${path}`} />))}
        </Routes>
    </BrowserRouter>
);
