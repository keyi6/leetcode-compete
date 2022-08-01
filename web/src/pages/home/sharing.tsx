import React from 'react';
import { useWatchListData, VerticalFlex } from '../../common';
import { WatchList } from './watch_list';
import { CompeteList } from './compete_list';
import { AddUser } from './add_user';

export const Sharing: React.FC = () => {
    const { watchList } = useWatchListData();

    return (
        <>
            <VerticalFlex>
                <h1>Sharing</h1>

                <CompeteList />
                <WatchList watchList={watchList} />
            </VerticalFlex>

            <AddUser />
        </>
    );
};
