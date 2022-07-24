import styled from "@emotion/styled";
import { useMemo } from "react";
import { Color } from "../constants";
import { ICompetitionStatus } from "../interfaces";
import { HorizontalFlex, VerticalFlex } from "./flex";

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

export interface IScoresProps {
    status: ICompetitionStatus;
    fullWidth?: boolean;
}

const FULL_WIDTH_STYLE: React.CSSProperties = {
    justifyContent: 'space-between',
    width: '100%',
};

export const Scores: React.FC<IScoresProps> = ({ status, fullWidth = false }) => {
    const info = useMemo(() => {
        const temp = (status?.status || []).map(({ user, scores }) => ({
            name: user.username,
            totalScore: sum(scores),
            todayScore: getLast(scores),
        }));
        const max = temp.reduce((prev, cur) => Math.max(prev, cur.totalScore), 0);
        return temp.map(t => ({ ...t, isWinning: max === t.totalScore }));
    }, [status]);

    return (
        <HorizontalFlex style={fullWidth ? FULL_WIDTH_STYLE : {}}>
            {info.map(({ name, todayScore, totalScore, isWinning }) => (
                <VerticalFlex key={`compete-list-item-${status.competitionId}-${name}`}
                    style={{ display: 'inline-flex', paddingRight: 20, color: isWinning ? Color.GOLD : Color.GOLD_LIGHT }}
                >
                    <Name>{name}</Name>
                    <TotalScore>{totalScore.toLocaleString()}PTS</TotalScore>
                    {todayScore && <TodayScore>{todayScore.toLocaleString()} Today</TodayScore>}
                </VerticalFlex>
            ))}
        </HorizontalFlex>
    );
};
