import React from 'react';
import { useParams } from 'react-router-dom';
import { DataCenter, ICompetitionStatus } from '../../common';
import { VerticalFlex, Scores } from '../../components';
import { useAsyncMemo } from '../../hooks';
import { Charts } from './charts';

export const Competition: React.FC = () => {
    const { competitionId } = useParams();
    const status = useAsyncMemo<ICompetitionStatus | undefined | 'loading'>(
        async () => {
            if (!competitionId) return 'loading';
            return await DataCenter.getInstance().getCompetitionStatus(competitionId);
        },
        'loading',
        [competitionId],
    );

    if (status === 'loading') {
        return (<h1>loading...</h1>);
    }
    if (!status) {
        return (<h1>Sorry, this competition id: {competitionId} is not valid.</h1>);
    }

    return (
        <VerticalFlex>
            <h1>Competition</h1>

            <Scores status={status} fullWidth />
            <Charts status={status} />
        </VerticalFlex>
    );
};
