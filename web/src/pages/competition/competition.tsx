import React from 'react';
import { useParams } from 'react-router-dom';
import { ICompetitionInfo, useAsyncMemo } from '../../common';

export const Competition: React.FC = () => {
    const { competitionId } = useParams();

    return (
        <div>
            {competitionId}
        </div>
    );
};
