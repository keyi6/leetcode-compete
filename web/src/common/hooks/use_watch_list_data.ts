import { useEffect, useState } from 'react';
import { DataCenter } from '../data_center';
import { IUser } from '../user.interface';

export function useWatchListData() {
    const [watchList, setWatchList] = useState<IUser[]>([]);

    useEffect(() => {
        DataCenter.getInstance().getWatchList().then(setWatchList);
    }, []);

    return { watchList, setWatchList };
}
