import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Card, CardList, HorizontalFlex, VerticalFlex, Rings } from '../../components';
import { Color, DataCenter, Goal, IUser, IUserDailyStatus } from '../../common';
import { useAsyncMemo } from '../../hooks';
import { getAdjacentDaysTimestamp } from '../../utils';

const Name = styled.p`
    margin: 0;
    font-size: 1.5rem;
`;

const Number = styled.b`
    color: ${Color.RED};
    font-size: 1.5rem;
`;

const WatchListItem: React.FC<IUser & { timestamp: number }> = ({ timestamp, ...user }) => {
    const { count, percentage, goal } = useAsyncMemo<IUserDailyStatus>(
        () => DataCenter.getInstance().getUserDailyStatus(user, timestamp),
        { percentage: [0, 0, 0], count: 0, goal: Goal.TOTAL },
    );

    const nav = useNavigate();

    return (
        <Card onClick={() => {
            nav(`/user/${encodeURIComponent(user.username)}/${encodeURIComponent(user.endpoint)}/${timestamp}`);
        }}>
            <HorizontalFlex>
                <Rings percentage={percentage} />

                <VerticalFlex style={{ display: `inline-flex`, alignItems: 'flex-start', paddingLeft: 20 }}>
                    <Name>{user.username}</Name>
                    <Number>{Math.round(count / goal * 100)}%</Number>
                    <Number>{count}/{goal}</Number>
                </VerticalFlex>
            </HorizontalFlex>
        </Card>
    )
};

const DailyWatchList: React.FC<{ watchList: IUser[]; timestamp: number }> = (props) => {
    const title = new Date(props.timestamp).toDateString();
    return (
        <CardList>
            <h2 style={{ marginBottom: 10, marginTop: 20 }}>{title}</h2>
            {props.watchList.map(({ username, endpoint }) => (
                <WatchListItem key={`watch-list-${props.timestamp}-${username}-${endpoint}`}
                    username={username} endpoint={endpoint} timestamp={props.timestamp} />
            ))}
        </CardList>
    );
};

export const WatchList: React.FC = () => {
    const past5Days = useMemo<number[]>(() => getAdjacentDaysTimestamp(5, 'past'), []);
    const [watchList, setWatchList] = useState<IUser[]>([]);
    useEffect(() => {
        const subscription = DataCenter.getInstance().getWatchList$().subscribe((wl) => {
            setWatchList(wl);
        });
        return () => subscription.unsubscribe();
    });

    return (
        <>
            {past5Days.map(ts => <DailyWatchList timestamp={ts} watchList={watchList} key={`watch-list-${ts}`} />)}
        </>
    );
};
