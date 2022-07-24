import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Card, CardList, Color, DataCenter, getPastDaysTimestamp, HorizontalFlex, IUser, IUserDailyStatus, Ring, toQuerystring, useAsyncMemo, VerticalFlex } from '../../common';

export interface IWatchListProps {
    watchList: IUser[];
}

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
        { percentage: 0, count: 0, goal: 5 },
    );

    const nav = useNavigate();

    return (
        <Card onClick={() => {
            nav(`/user/${encodeURIComponent(user.username)}/${encodeURIComponent(user.endpoint)}/${timestamp}`);
        }}>
            <HorizontalFlex>
                {/* TODO: 3 rings stand for easy/hard/medium */}
                <Ring percentage={[percentage, percentage, percentage]} />

                <VerticalFlex style={{ display: `inline-flex`, alignItems: 'flex-start', paddingLeft: 20 }}>
                    <Name>{user.username}</Name>
                    <Number>{percentage}%</Number>
                    <Number>{count}/{goal}</Number>
                </VerticalFlex>
            </HorizontalFlex>
        </Card>
    )
};

const DailyWatchList: React.FC<IWatchListProps & { timestamp: number }> = (props) => {
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

export const WatchList: React.FC<IWatchListProps> = (props: IWatchListProps) => {
    const past5Days = useMemo<number[]>(() => getPastDaysTimestamp(5), []);

    return (
        <>
            {past5Days.map(ts => <DailyWatchList timestamp={ts} {...props} key={`watch-list-${ts}`} />)}
        </>
    );
};
