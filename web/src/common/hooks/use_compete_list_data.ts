import { useEffect, useState } from 'react';
import { DataCenter } from '../data_center';
import { ICompetitionInfo } from '../interfaces';

export function useCompeteListData() {
    const [competeList, setCompeteList] = useState<ICompetitionInfo[]>([]);

    useEffect(() => {
        DataCenter.getInstance().getCompeteList().then(setCompeteList);
    }, []);

    return { competeList, setCompeteList };
}
