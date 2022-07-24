import styled from '@emotion/styled';
import {
    Card, CardList, Color, DataCenter, HorizontalFlex, ICompetitionInfo, ICompetitionStatus,
    Scores, useAsyncMemo,
} from '../../common';
import { useNavigate } from 'react-router-dom';

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

    const nav = useNavigate();

    return !info ? null : (
        <Card onClick={() => nav(`/competition/${info.competitionId}`)}>
            <HorizontalFlex>
                <Scores status={info} />
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
