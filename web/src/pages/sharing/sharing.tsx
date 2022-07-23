import React, { useCallback, useState } from 'react';
import Input from 'rsuite/Input';
import Button from 'rsuite/Button';
import {
    DataCenter, Endpoint, useCompeteListData, useWatchListData,
} from '../../common';
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
        <div>
            <label>user name</label>
            <Input placeholder="input LeetCode user name" value={name} onChange={setName} />
            <Button appearance="primary" onClick={onSearchUser}>watch</Button>

            <CompeteList competeList={competeList} />
            <WatchList watchList={watchList} />
        </div>
    );
};
