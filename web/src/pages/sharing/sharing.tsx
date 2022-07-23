import React, { useCallback, useState } from 'react';
import { DataCenter, Endpoint, useCompeteListData, useWatchListData, VerticalFlex } from '../../common';
import { WatchList } from './watch_list';
import { CompeteList } from './compete_list';

export const Sharing: React.FC = () => {
    const dataCenter = DataCenter.getInstance();

    const [name, setName] = useState<string>('');

    const { watchList, setWatchList } = useWatchListData();
    const { competeList, setCompeteList } = useCompeteListData();

    const onSearchUser = useCallback(async () => {
        await dataCenter.addUserToWatchList({ username: name, endpoint: Endpoint.CN });
        const wl = await dataCenter.getWatchList();
        setWatchList(wl);
    }, [name]);


    return (
        <VerticalFlex>
            <h1>Sharing</h1>

            <CompeteList competeList={competeList} />
            <WatchList watchList={watchList} />
        </VerticalFlex>
    );
};
