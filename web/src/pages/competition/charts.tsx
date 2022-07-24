import { getAdjacentDaysTimestamp, HorizontalFlex, ICompetitionStatus, VerticalFlex } from "../../common";

export interface IChartsProps {
    status: ICompetitionStatus;
}

export const Charts: React.FC<IChartsProps> = ({ status }) => {
    const startTime = status.startTime;
    const days = getAdjacentDaysTimestamp(7, 'future', startTime);

    return (
        <HorizontalFlex>
            {days.map((d, index) => (
                <VerticalFlex key={`chart-${status.competitionId}-${d}`}>
                    <p>{(new Date(d)).toDateString()}</p>

                    {status.status.map(u => 
                        <p key={`chart-${status.competitionId}-${d}-${u.user.username}`}>{u.scores[index] || 0}</p>
                    )}
                </VerticalFlex>
            ))}
        </HorizontalFlex>
    );
};