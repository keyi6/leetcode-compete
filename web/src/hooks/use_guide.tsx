import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataCenter } from '../common';

export function useGuide() {
    const nav = useNavigate();

    useEffect(() => {
        DataCenter.getInstance().getMyUserInfo().then(user => {
            if (!user?.username) nav('/guide');
        });
    });
}
