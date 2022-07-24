import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Color, DataCenter, Endpoint, HorizontalFlex, IUser, IUserDailyStatus, Ring, useAsyncMemo, VerticalFlex } from '../../common';

const Number = styled.div`
    color: ${Color.RED};
`;

export const UserInfo: React.FC = () => {
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

    return (
        <VerticalFlex>
            <h1>{username}</h1>

            <HorizontalFlex style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {/* TODO: 3 rings stand for easy/hard/medium */}
                <Ring percentage={[percentage, percentage, percentage]} size={200} />
                <div>
                    <p>{new Date(ts).toDateString()}</p>
                    <Divider style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
            </HorizontalFlex>

            <h3>submissions: <Number>{count}/{goal}</Number></h3>

            <Button>Compete with {username}</Button>
        </VerticalFlex>
    );
}
