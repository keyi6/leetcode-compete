import React, { useState } from 'react';
import { DataCenter, useCompeteListData, useWatchListData, VerticalFlex } from '../../common';
import { WatchList } from './watch_list';
import { CompeteList } from './compete_list';
import { Add } from './add';

export const Sharing: React.FC = () => {
    const dataCenter = DataCenter.getInstance();

    const [name, setName] = useState<string>('');

    const { watchList, setWatchList } = useWatchListData();
    const { competeList, setCompeteList } = useCompeteListData();

    return (
        <>
            <VerticalFlex>
                <h1>Sharing</h1>

                <CompeteList competeList={competeList} />
                <WatchList watchList={watchList} />
            </VerticalFlex>

            <Add />
        </>
    );
};
