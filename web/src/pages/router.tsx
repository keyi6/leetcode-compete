import { HashRouter, Routes, Route } from 'react-router-dom';
import styled from '@emotion/styled';
import { Add } from './add';
import { Home } from './home';
import { Setup } from './setup';
import { User } from './user';
import { Competition } from './competition';
import { Guide } from './guide';
import { NoMatch } from './no_match';
import { Rules } from './rules';

interface IPageConfig {
    path: string;
    element: JSX.Element;
}

const PAGE_CONFIGS: IPageConfig[] = [
    {
        path: '/setup',
        element: <Setup />,
    },
    {
        path: '/guide',
        element: <Guide />,
    },
    {
        path: '/rules',
        element: <Rules />,
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
    {
        path: '*',
        element: <NoMatch />,
    },
];

const Main = styled.main`
    width: min(100vw, 600px);
    margin: auto;
    padding: 20px;
`;

export const Router = () => (
    <HashRouter>
        <Main>
            <Routes>
                {PAGE_CONFIGS.map(({path, element}) => (<Route path={path} element={element} key={`page-${path}`} />))}
            </Routes>
        </Main>
    </HashRouter>
);
