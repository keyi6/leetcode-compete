import styled from "@emotion/styled";
import { useMemo } from "react";
import { Color } from "../common/constants";
import { ICompetitionStatus } from "../common/interfaces";
import { HorizontalFlex, VerticalFlex } from "./flex";

function getLast(arr: number[]): number {
    if (arr.length === 0) return 0;
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
    const info = useMemo(() => (status?.status || []).map(s => ({
        ...s,
        name: s.user.username,
        todayScore: getLast(s.scores),
    })), [status]);

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
