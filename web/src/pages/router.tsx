import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Add } from './add';
import { Home } from './home';
import { Setup } from './setup';
import { User } from './user';
import { Competition } from './competition';
import styled from '@emotion/styled';

interface IPageConfig {
    path: string;
    element: JSX.Element;
}

const PAGE_CONFIGS: IPageConfig[] = [
    {
        path: '/setup',
        element: <Setup />,
    },
    // {
    //     path: '/summary',
    //     element: <Summary />
    // },
    {
        path: '/add',
        element: <Add />
    },
    {
        path: '/user/:username/:endpoint/:timestamp',
        element: <User />
    },
    {
        path: '/competition/:competitionId',
        element: <Competition />
    },
    {
        path: '/',
        element: <Home />
    },
];

const Main = styled.main`
    width: min(100vw, 600px);
    margin: auto;
    padding: 20px;
`;

export const Router = () => (
    <BrowserRouter>
        <Main>
            <Routes>
                {PAGE_CONFIGS.map(({path, element}) => (<Route path={path} element={element} key={`page-${path}`} />))}
            </Routes>
        </Main>
    </BrowserRouter>
);
