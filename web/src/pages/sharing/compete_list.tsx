import styled from '@emotion/styled';
import {
    Card, CardList, Color, DataCenter, HorizontalFlex, ICompetitionInfo, ICompetitionStatus,
    useAsyncMemo, VerticalFlex,
} from '../../common';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

function sum(arr: number[]): number {
    return arr.reduce((prev, cur) => prev + cur, 0);
}

function getLast(arr: number[]): number | undefined {
    if (arr.length === 0) return;
    return arr[arr.length - 1];
}

const Name = styled.p`
    margin: 0;
    font-size: 1.5rem;
`;

const TotalScore = styled.p`
    margin: 10px 0;
    font-size: 2rem;
`;

const TodayScore = styled.p`
    margin: 0;
    font-size: 1rem;
`;

const Days = styled.p`
    margin-left: auto;
    color: ${Color.GOLD};
    font-size: 1.1rem;
`;

function getDaysLeftWording(daysLeft: number): string {
    if (daysLeft === 0) return 'Ending Today';
    if (daysLeft < 0) return 'Starting Tomorrow';
    return `${daysLeft} Days Left`;
}

const CompeteListItem: React.FC<ICompetitionInfo> = ({ competitionId }) => {
    const info = useAsyncMemo<ICompetitionStatus | undefined>(
        async () => DataCenter.getInstance().getCompetitionStatus(competitionId),
        undefined,
    );
    const status = useMemo(() => {
        const temp = (info?.status || []).map(({ user, scores }) => ({
            name: user.username,
            totalScore: sum(scores),
            todayScore: getLast(scores),
        }));
        const max = temp.reduce((prev, cur) => Math.max(prev, cur.totalScore), 0);
        return temp.map(t => ({ ...t, isWinning: max === t.totalScore }));
    }, [info]);

    const nav = useNavigate();

    return !info ? null : (
        <Card onClick={() => nav(`/competition/${info.competitionId}`)}>
            <HorizontalFlex>
                {status.map(({ name, todayScore, totalScore, isWinning }) => (
                    <VerticalFlex key={`compete-list-item-${info.competitionId}-${name}`}
                        style={{ display: 'inline-flex', paddingRight: 20, color: isWinning ? Color.GOLD : Color.GOLD_LIGHT }}
                    >
                        <Name>{name}</Name>
                        <TotalScore>{totalScore.toLocaleString()}PTS</TotalScore>
                        {todayScore && <TodayScore>{todayScore.toLocaleString()} Today</TodayScore>}
                    </VerticalFlex>
                ))}

                <Days>{getDaysLeftWording(info.daysLeft)}</Days>
            </HorizontalFlex>
        </Card>
    );
}

export interface ICompeteListProps {
    competeList: ICompetitionInfo[];
}

export const CompeteList: React.FC<ICompeteListProps> = (props: ICompeteListProps) => (
    <CardList>
        <h2>Competitions</h2>
        {props.competeList.map((info) => (
            <CompeteListItem key={`compete-list-${info.competitionId}`} {...info} />
        ))}
    </CardList>
);
