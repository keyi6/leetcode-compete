import React from 'react';
import { VerticalFlex } from '../../components';
import { WatchList } from './watch_list';
import { CompeteList } from './compete_list';
import { AddUser } from './add_user';

export const Sharing: React.FC = () => {
    return (
        <>
            <VerticalFlex>
                <h1>Sharing</h1>

                <CompeteList />
                <WatchList />
            </VerticalFlex>

            <AddUser />
        </>
    );
};
