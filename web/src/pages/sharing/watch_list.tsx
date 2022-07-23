import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, CardList, Color, DataCenter, HorizontalFlex, IUser, Ring, useAsyncMemo, VerticalFlex } from '../../common';

export interface IWatchListProps {
    watchList: IUser[];
}

const Name = styled.p`
    margin: 0;
    font-size: 1.1rem;
`;

const Number = styled.b`
    color: ${Color.RED};
    font-size: 1.5rem;
`;

const WatchListItem: React.FC<IUser> = ({ username, endpoint }) => {
    const count = useAsyncMemo<number>(async () => 
        (await DataCenter.getInstance().getUserRecentSubmission({ username, endpoint })).length,
        0,
    );
    const goal = useAsyncMemo<number>(DataCenter.getInstance().getGoal, 3);
    const percentage = useMemo(() => Math.round(count / goal * 100), [count, goal]);

    return (
        <Card>
            <HorizontalFlex>
                {/* TODO: 3 rings stand for easy/hard/medium */}
                <Ring percentage={[percentage, percentage, percentage]} />

                <VerticalFlex style={{ display: `inline-flex`, alignItems: 'flex-start', paddingLeft: 20 }}>
                    <Name>{username}@{endpoint}</Name>
                    <Number>{percentage}%</Number>
                    <Number>{count}/{goal}</Number>
                </VerticalFlex>
            </HorizontalFlex>
        </Card >
    )
};

export const WatchList: React.FC<IWatchListProps> = (props: IWatchListProps) => (
    <CardList>
        <h2>watch list</h2>
        {props.watchList.map(({ username, endpoint }) => (
            <WatchListItem key={`watch-list-${username}-${endpoint}`} username={username} endpoint={endpoint} />
        ))}
    </CardList>
);
