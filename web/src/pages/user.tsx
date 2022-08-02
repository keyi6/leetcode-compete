import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { Color, DataCenter, Endpoint, IUser, IUserDailyStatus } from '../common';
import { VerticalFlex, HorizontalFlex, Ring, Submissions } from '../components';
import { useGuide, useAsyncMemo } from '../hooks';
import { equal, ONE_DAY } from '../utils';

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
        { percentage: [0, 0, 0], count: 0, goal: 5 },
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
            const id = await DataCenter.getInstance().competeUser(user);
            nav(`/competition/${id}`);
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
                <Ring percentage={percentage} size={200} />
                <p>{new Date(ts).toDateString()}</p>
            </HorizontalFlex>
            <h3>submissions: <Number>{count}/{goal}</Number></h3>

            {isMyself ? null : <Button variant="contained" onClick={handleCompete} disabled={!canCompete}>Compete with {username}</Button>}
            {isMyself ? null : <Button onClick={handleRemove}>Remove {username}</Button>}
            {isMyself ? null : <Button onClick={() => nav('/rules')}>View Rules</Button>}

            {err && 
                <Alert severity="error">
                    Failed to compete with user {username}. Detail: {err}
                </Alert>
            }

            <Submissions user={user} startTime={ts} endTime={ts + ONE_DAY} />
        </VerticalFlex>
    );
}
