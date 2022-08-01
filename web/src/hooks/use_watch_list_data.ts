import { useEffect, useState } from 'react';
import { DataCenter } from '../common/data_center';
import { IUser } from '../common/interfaces';

export function useWatchListData() {
    const [watchList, setWatchList] = useState<IUser[]>([]);

    useEffect(() => {
        DataCenter.getInstance().getWatchList().then(setWatchList);
    }, []);

    return { watchList, setWatchList };
}
