import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { DataCenter, ICompetitionStatus } from '../../common';
import { VerticalFlex, Scores, Submissions } from '../../components';
import { useAsyncMemo } from '../../hooks';
import { Charts } from './charts';

export const Competition: React.FC = () => {
    const { competitionId } = useParams();
    const nav = useNavigate();
    const status = useAsyncMemo<ICompetitionStatus | undefined | 'loading'>(
        async () => {
            if (!competitionId) return 'loading';
            return await DataCenter.getInstance().getCompetitionStatus(competitionId);
        },
        'loading',
        [competitionId],
    );

    const [activeTab, setActiveTab] = useState(0);
    const handleChangeTab = useCallback((_: React.SyntheticEvent, v: number) => {
        setActiveTab(v);
    }, []);

    if (status === 'loading') return (<h1>loading...</h1>);
    if (!status) return (<h1>Sorry, this competition id: {competitionId} is not valid.</h1>);

    return (
        <VerticalFlex>
            <h1>Competition</h1>
            <h3 style={{ marginTop: 0 }}>
                {new Date(status.startTime).toLocaleDateString()} - {new Date(status.endTime).toLocaleDateString()}
            </h3>

            <Scores status={status} fullWidth />
            <Charts status={status} />

            <Button style={{ margin: '20px 0' }} variant="contained" onClick={() => nav('/rules')}>View Rules</Button>

            <Tabs value={activeTab} onChange={handleChangeTab} aria-label="basic tabs example">
                {status.participants.map(u => <Tab label={u.username} key={`${status.competitionId}-${u.username}-${u.endpoint}`} />)}
            </Tabs>
            <Submissions user={status.participants[activeTab]} startTime={status.startTime} endTime={status.endTime} />
        </VerticalFlex>
    );
};
