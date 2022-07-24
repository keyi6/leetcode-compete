import React from 'react';
import { useCompeteListData, useWatchListData, VerticalFlex } from '../../common';
import { WatchList } from './watch_list';
import { CompeteList } from './compete_list';
import { AddUser } from './add_user';

export const Sharing: React.FC = () => {
    const { watchList } = useWatchListData();
    const { competeList } = useCompeteListData();

    return (
        <>
            <VerticalFlex>
                <h1>Sharing</h1>

                <CompeteList competeList={competeList} />
                <WatchList watchList={watchList} />
            </VerticalFlex>

            <AddUser />
        </>
    );
};
