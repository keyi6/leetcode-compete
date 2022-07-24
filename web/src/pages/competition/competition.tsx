import React from 'react';
import { useParams } from 'react-router-dom';
import { DataCenter, ICompetitionStatus, Scores, useAsyncMemo, VerticalFlex } from '../../common';
import { Charts } from './charts';

export const Competition: React.FC = () => {
    const { competitionId } = useParams();
    const status = useAsyncMemo<ICompetitionStatus | undefined>(
        async () => await DataCenter.getInstance().getCompetitionStatus(competitionId || ''),
        undefined,
        [competitionId],
    );

    if (!status) {
        return (<h1>Sorry, this competition id: ${competitionId} is not valid.</h1>);
    }

    return (
        <VerticalFlex>
            <h1>Competition</h1>

            <Scores status={status} fullWidth />
            <Charts status={status} />
        </VerticalFlex>
    );
};
