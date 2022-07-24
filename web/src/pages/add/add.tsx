import React from 'react';
import { DataCenter, IUser, User } from '../../common';

export const Add: React.FC = () => {
    const onAddUser = async (user: IUser) => {
        return DataCenter.getInstance().addUserToWatchList(user);
    };

    return (
        <User onClickCallback={onAddUser} />
    );
};
