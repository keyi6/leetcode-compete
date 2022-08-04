import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { Color, DataCenter, Endpoint, ICompetitionInfo, IUser, IUserDailyStatus } from '../common';
import { VerticalFlex, HorizontalFlex, Rings, Submissions } from '../components';
import { useGuide, useAsyncMemo } from '../hooks';
import { equal, ONE_DAY } from '../utils';
import { combineLatest } from 'rxjs';

const Number = styled.div`
    color: ${Color.RED};
`;

function isInCompetition(users: IUser[], competition: ICompetitionInfo): boolean {
    const { participants } = competition;
    return users.every(u => (participants.find(p => equal(p, u))));
}

export const User: React.FC = () => {
    useGuide();

    const { endpoint, username, timestamp } = useParams();
    const user = useMemo<IUser>(() => ({
        username: username || '',
        endpoint: endpoint as Endpoint || Endpoint.CN,
    }), [username, endpoint])
    const ts = useMemo<number>(() => timestamp ? parseInt(timestamp) : 0, [timestamp]); 

    const { count, percentage, goal } = useAsyncMemo<IUserDailyStatus>(
        () => DataCenter.getInstance().getUserDailyStatus(user, ts),
        { percentage: [0, 0, 0], count: 0, goal: 5 },
        [endpoint, username],
    );

    const [isMyself, setIsMyself] = useState<boolean>(false);
    const [canCompete, setCanCompete] = useState<boolean>(true);
    useEffect(() => {
        const subscription = combineLatest([
            DataCenter.getInstance().getMyUserInfo$(),
            DataCenter.getInstance().getCompetitions$(),
        ]).subscribe(([me, competitions]) => {
            if (!me) return;

            setIsMyself(equal(me, user));
            setCanCompete(!competitions.find(c => isInCompetition([user, me], c)));
        });
        return () => subscription.unsubscribe();
    }, [user]);

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

    const handleRemove = () => {
        DataCenter.getInstance().unwatchUser(user);
        nav('/');
    }

    return (
        <VerticalFlex style={{ gap: 15 }}>
            <h1 style={{ margin: 0 }}>{username}</h1>

            <HorizontalFlex style={{ gap: 20, alignItems: 'flex-start' }}>
                <Rings percentage={percentage} size={200} />
                <p>{new Date(ts).toDateString()}</p>
            </HorizontalFlex>
            <h3>submissions: <Number>{count}/{goal}</Number></h3>

            {isMyself ? null : <Button variant="contained" onClick={handleCompete} disabled={!canCompete}>Compete with {username}</Button>}
            {err && 
                <Alert severity="error">
                    Failed to compete with user {username}. Detail: {err}
                </Alert>
            }

            {isMyself ? null : <Button variant="outlined" onClick={handleRemove}>Remove {username}</Button>}
            {isMyself ? null : <Button variant="outlined" onClick={() => nav('/rules')}>View Rules</Button>}

            <Submissions user={user} startTime={ts} endTime={ts + ONE_DAY} />
        </VerticalFlex>
    );
}
