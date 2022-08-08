import styled from '@emotion/styled';
import { useMemo } from 'react';
import { ICompetitionStatus, Color } from '../common';
import { HorizontalFlex, VerticalFlex } from './flex';

function getLast(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr[arr.length - 1];
}

const Name = styled.p`
    margin: 0;
    font-size: 1em;
    text-overflow: clip;
`;

const TotalScore = styled.p`
    margin: 10px 0;
    font-size: 1.4rem;
`;

const TodayScore = styled.p`
    margin: 0;
    font-size: 0.8rem;
`;

export interface IScoresProps {
    status: ICompetitionStatus;
    fullWidth?: boolean;
}

function calcStyle(fullWidth: boolean) {
    const style = {
        alignItems: 'flex-end',
        flexGrow: 1,
    };
    if (fullWidth) return { ...style, justifyContent: 'space-between', width: '100%' };
    return style;
}

export const Scores: React.FC<IScoresProps> = ({ status, fullWidth = false }) => {
    const info = useMemo(() => (status?.status || []).map(s => ({
        ...s,
        name: s.user.username,
        todayScore: getLast(s.scores),
    })), [status]);

    return (
        <HorizontalFlex style={calcStyle(fullWidth)} >
            {info.map(({ name, todayScore, totalScore, isWinning }) => (
                <VerticalFlex key={`compete-list-item-${status.competitionId}-${name}`}
                    style={{
                        display: 'inline-flex',
                        paddingRight: 20,
                        color: isWinning ? Color.GOLD : Color.GOLD_LIGHT,
                        width: 'calc((min(100vw, 600px) - 80px - min(60px, 16vw)) / 2)',
                    }}>
                    <Name>{name}</Name>
                    <TotalScore>{totalScore.toLocaleString()}PTS</TotalScore>
                    {<TodayScore>{todayScore.toLocaleString()} Today</TodayScore>}
                </VerticalFlex>
            ))}
        </HorizontalFlex>
    );
};
