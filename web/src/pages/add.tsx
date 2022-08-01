import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataCenter, IUser } from '../common';
import { SearchUser } from '../components';

export const Add: React.FC = () => {
    const nav = useNavigate();

    const addUser = async (user: IUser) => {
        await DataCenter.getInstance().watchUser(user);
        nav('/');
    };

    return (
        <SearchUser onClick={addUser} />
    );
};
