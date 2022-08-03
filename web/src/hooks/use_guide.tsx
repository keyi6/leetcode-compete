import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataCenter } from '../common';

export function useGuide() {
    const nav = useNavigate();

    useEffect(() => {
        const subscription = DataCenter.getInstance().getMyUserInfo$().subscribe(me => {
            if (!me?.username) nav('/guide');
        });
        return () => subscription.unsubscribe();
    });
}
