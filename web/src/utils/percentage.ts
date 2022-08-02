import uniq from 'lodash/uniq';
import { Difficulty, Goal, IUserDailyStatus } from '../common';
import { ISubmission } from '../common/data_center/services';

export function calcDailyStatus(submissions: ISubmission[]): IUserDailyStatus {
    const l1 = uniq(submissions.map(s => s.titleSlug)).length;
    const p1 = l1 / Goal.TOTAL * 100;

    const l2 = uniq(submissions.filter(s => [Difficulty.EASY, Difficulty.MEDIUM, null].includes(s.difficulty))
        .map(s => s.titleSlug)).length
    const p2 = l2 / Goal.EASY_AND_MEDIUM * 100;

    const l3 = uniq(submissions.filter(s => s.difficulty === Difficulty.HARD)
        .map(s => s.titleSlug)).length
    const p3 = l3 / Goal.HARD * 100;

    return {
        percentage: [p1, p2, p3],
        count: l1,
        goal: Goal.TOTAL,
    };
}