import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import styled from '@emotion/styled';
import { Color, DataCenter, ICompetitionStatus } from '../../common';
import { HorizontalFlex, Scores, CardList, Card } from '../../components';

const Days = styled.p`
    margin-left: auto;
    color: ${Color.GOLD};
    font-size: 1rem;
    max-width: max(60px, 16vw);
`;

function getDaysLeftWording(daysLeft: number): string {
    if (daysLeft < 1) return 'Ended'; 
    if (daysLeft === 1) return 'Ending Today';
    if (daysLeft > 7) return 'Starting Tomorrow';
    return `${daysLeft} Days Left`;
}

const CompeteListItem: React.FC<{ status: ICompetitionStatus }> = ({ status }) => {
    const nav = useNavigate();

    return !status? null : (
        <Card onClick={() => nav(`/competition/${status.competitionId}`)}>
            <HorizontalFlex>
                <Scores status={status} />
                <Days>{getDaysLeftWording(status.daysLeft)}</Days>
            </HorizontalFlex>
        </Card>
    );
}


export const CompeteList: React.FC = () => {
    const [competitionStatus, setCompetitionStatus] = useState<ICompetitionStatus[]>([]);

    useEffect(() => {
        const s$ = DataCenter.getInstance().getCompetitions$();
        const subscription = s$.subscribe(async (v) => {
            await Promise.all(v.map(async (c) => {
                const status = await DataCenter.getInstance().getCompetitionStatus(c.competitionId);
                if (status) setCompetitionStatus(prev => (uniqWith([...prev, status], isEqual)));
            }));
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <CardList>
            <h2>Competitions</h2>
            {competitionStatus.map(status => (
                <CompeteListItem key={`compete-list-${status.competitionId}`} status={status} />
            ))}
        </CardList>
    );
}