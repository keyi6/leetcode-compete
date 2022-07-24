import React from 'react';
import { DataCenter, IUser, SearchUser } from '../../common';

export const Add: React.FC = () => {
    const addUser = async (user: IUser) => {
        return DataCenter.getInstance().addUserToWatchList(user);
    };

    return (
        <SearchUser onClick={addUser} />
    );
};
