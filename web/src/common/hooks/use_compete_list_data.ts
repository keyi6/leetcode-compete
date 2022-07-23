import { useEffect, useState } from 'react';
import { DataCenter } from '../data_center';
import { IUser } from '../interfaces';

export function useCompeteListData() {
    const [competeList, setCompeteList] = useState<IUser[]>([]);

    useEffect(() => {
        DataCenter.getInstance().getCompeteList().then(setCompeteList);
    }, []);

    return { competeList, setCompeteList };
}
