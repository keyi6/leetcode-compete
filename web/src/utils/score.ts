import uniq from 'lodash/uniq';
import { Difficulty, ISubmission } from '../common';

export const DAILY_LIMIT = 800;

export function calcDailyScore(dailySubmissions: ISubmission[]): number {
    return Math.min(DAILY_LIMIT, [
        { difficulty: null, score: 80 },
        { difficulty: Difficulty.EASY, score: 80 },
        { difficulty: Difficulty.MEDIUM, score: 100 },
        { difficulty: Difficulty.HARD, score: 200 },
    ].map(({ difficulty, score }) => 
        uniq(dailySubmissions
            .filter(s => s.difficulty === difficulty)
            .map(s => s.titleSlug)
        ).length * score
    )
    .reduce((prev, cur) => prev + cur, 0));
}
