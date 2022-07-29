import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Color, DataCenter, Endpoint, HorizontalFlex, IUser, IUserDailyStatus, Ring, useAsyncMemo, useGuide, VerticalFlex } from '../../common';

const Number = styled.div`
    color: ${Color.RED};
`;

export const User: React.FC = () => {
    useGuide();

    const { endpoint, username, timestamp } = useParams();
    const user: IUser = {
        username: username || '',
        endpoint: endpoint as Endpoint || Endpoint.CN,
    };
    const ts: number = timestamp ? parseInt(timestamp) : 0; 

    const { count, percentage, goal } = useAsyncMemo<IUserDailyStatus>(
        () => DataCenter.getInstance().getUserDailyStatus(user, ts),
        { percentage: 0, count: 0, goal: 5 },
        [endpoint, username],
    );

    const isMyself = useAsyncMemo(
        async () => DataCenter.getInstance().getMyUserInfo().then(me => (username === me.username && endpoint === me.endpoint)),
        false,
    );

    const [canCompete, setCanCompete] = useState<boolean>(false);
    useEffect(() => {
        DataCenter.getInstance().getCompeteList().then(comps => {
            if (comps.find(us => us.participants.find(u => u.username === username && u.endpoint === endpoint))) {
                setCanCompete(false);
            }
        });
    });

    const nav = useNavigate();

    const handleCompete = async () => {
        await DataCenter.getInstance().addUserToCompeteList(user);
    };

    const handleRemove = async () => {
        await DataCenter.getInstance().removeUser(user);
        nav('/');
    }

    return (
        <VerticalFlex style={{ gap: 20 }}>
            <h1 style={{ margin: 0 }}>{username}</h1>

            <HorizontalFlex style={{ gap: 20, alignItems: 'flex-start' }}>
                <Ring percentage={[percentage, percentage, percentage]} size={200} />
                <p>{new Date(ts).toDateString()}</p>
            </HorizontalFlex>
            <h3>submissions: <Number>{count}/{goal}</Number></h3>

            {isMyself ? null : <Button variant="contained" onClick={handleCompete} disabled={canCompete}>Compete with {username}</Button>}
            {isMyself ? null : <Button onClick={handleRemove}>Remove {username}</Button>}
        </VerticalFlex>
    );
}
