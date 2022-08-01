import uniq from 'lodash/uniq';
import { Difficulty } from '../common';
import { ISubmission } from '../common/data_center/services';

export const DAILY_LIMIT = 1000;

export function calcDailyScore(dailySubmissions: ISubmission[]): number {
    return [
        { difficulty: Difficulty.EASY, score: 80 },
        { difficulty: Difficulty.MEDIUM, score: 100 },
        { difficulty: Difficulty.HARD, score: 200 },
    ].map(({ difficulty, score }) => 
        uniq(dailySubmissions
            .filter(s => s.difficulty === difficulty)
            .map(s => s.titleSlug)
        ).length * score
    )
    .reduce((prev, cur) => prev + cur, 0);
}
