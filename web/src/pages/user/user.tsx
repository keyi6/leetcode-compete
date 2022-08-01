import React, { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Color, DataCenter, Endpoint, equal, HorizontalFlex, IUser,
    IUserDailyStatus, Ring, useAsyncMemo, useGuide, VerticalFlex,
} from '../../common';
import Alert from '@mui/material/Alert';

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
        async () => DataCenter.getInstance().getMyUserInfo().then(me => me && equal(me, user)),
        false,
    );

    const [canCompete, setCanCompete] = useState<boolean>(true);

    const nav = useNavigate();
    const [err, setErr] = useState<string>();

    const handleCompete = async () => {
        try {
            await DataCenter.getInstance().competeUser(user);
        } catch (err) {
            if (typeof(err) === 'string') setErr(err);
            else setErr(JSON.stringify(err));
        }
        setCanCompete(false);
    };

    const handleRemove = async () => {
        await DataCenter.getInstance().removeUserFromWatchList(user);
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

            {isMyself ? null : <Button variant="contained" onClick={handleCompete} disabled={!canCompete}>Compete with {username}</Button>}
            {isMyself ? null : <Button onClick={handleRemove}>Remove {username}</Button>}

            {err && 
                <Alert severity="error">
                    Failed to compete with user {username}. Detail: {err}
                </Alert>
            }
        </VerticalFlex>
    );
}
