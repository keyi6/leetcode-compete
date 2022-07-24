import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { Color, DataCenter, Endpoint, IUser, IUserDailyStatus, Ring, useAsyncMemo, VerticalFlex } from '../../common';

const Number = styled.div`
    color: ${Color.RED};
`;

export const User: React.FC = () => {
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

    const [canCompete, setCanCompete] = useState<boolean>(true);
    useEffect(() => {
        DataCenter.getInstance().getMyUserInfo().then(me => {
            if (username === me.username && endpoint === me.endpoint) {
                setCanCompete(false);
            }
        });

        DataCenter.getInstance().getCompeteList().then(comps => {
            if (comps.find(u => u.opponent.username === username && u.opponent.endpoint === endpoint)) {
                setCanCompete(false);
            }
        });
    });

    const onClick = async () => {
        await DataCenter.getInstance().addUserToCompeteList(user);
        setCanCompete(false);
    };

    return (
        <VerticalFlex>
            <h1 style={{ margin: 0 }}>{username}</h1>
            <p>{new Date(ts).toDateString()}</p>

            {/* TODO: 3 rings stand for easy/hard/medium */}
            <Ring percentage={[percentage, percentage, percentage]} size={200} />

            <h3>submissions: <Number>{count}/{goal}</Number></h3>

            <Button variant="contained" onClick={onClick} disabled={!canCompete}>Compete with {username}</Button>
        </VerticalFlex>
    );
}
