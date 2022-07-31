import styled from '@emotion/styled';
import { useMemo } from 'react';
import { Color, DAILY_LIMIT, getAdjacentDaysTimestamp, ICompetitionStatus } from '../../common';

const WIDTH = 8;
const HEIGHT = 150;

const Grid = styled.div`
    margin: 30px 0;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: ${HEIGHT}px 1fr;

    * > p {
        margin: 0;
    }
`;

const BarSvg = styled.svg`
    width: 100%;
    height: 100%;

    & > line {
        stroke: ${Color.GOLD};
        stroke-width: ${WIDTH};
        stroke-linecap: round;
    }

    & > .background {
        opacity: 0.2;
    }
`;

const Score = styled.p`
    color: ${(props: { isWinning: boolean }) => props.isWinning ? Color.GOLD : Color.GOLD_LIGHT };
`;

function calcY(score: number | undefined): number {
    const empty = HEIGHT - WIDTH / 2;
    const full = WIDTH / 2;
    if (!score) return empty;

    const p = score / DAILY_LIMIT;
    const h = (1 - p) * (empty - full) + full;
    return Math.max(Math.min(h, empty), full);
}

function calcX(i: number): number {
    return WIDTH / 2 + WIDTH * i + i * 2;
}

const Bar: React.FC<{ scores: number[], keyPrefix: string }> = ({ scores, keyPrefix }) => {
    return (
        <BarSvg>
            {scores.map((score, i) => ([
                <line x1={calcX(i)} y1={HEIGHT - WIDTH / 2} x2={calcX(i)} y2={WIDTH / 2}
                    className="background" key={`${keyPrefix}-bar-${i}-bg`} />,
                <line x1={calcX(i)} y1={HEIGHT - WIDTH / 2} x2={calcX(i)} y2={calcY(score)}
                    key={`${keyPrefix}-bar-${i}`}/>
            ]))}
        </BarSvg>
    );
};

export interface IChartsProps {
    status: ICompetitionStatus;
}

export const Charts: React.FC<IChartsProps> = ({ status }) => {
    const days = useMemo(() => getAdjacentDaysTimestamp(7, 'future', status.startTime).map((timestamp, index) => ({
        display: (new Date(timestamp)).toLocaleDateString('en-US', { weekday: 'short'}),
        timestamp,
        dailyScores: status.status.map(u => ({ score: u.scores[index], isWinning: u.isWinning })),
    })), [status]);

    return (
        <Grid>
            {days.map(({ timestamp, display, dailyScores }) => (
                <div key={`chart-${status.competitionId}-${timestamp}`}>
                    <Bar scores={dailyScores.map(s => s.score)} keyPrefix={timestamp.toString()} />

                    <p>{display}</p>

                    {dailyScores.map(({score, isWinning}, i) => 
                        <Score key={`chart-${status.competitionId}-${timestamp}-${i}`} isWinning={isWinning}>
                            {score !== undefined ? score : '--'}
                        </Score>
                    )}
                </div>
            ))}
        </Grid>
    );
};