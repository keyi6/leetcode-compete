import uniq from 'lodash/uniq';
import { ISubmission } from '../services';

export function calcDailyScore(dailySubmissions: ISubmission[]) {
    // TODO: different difficulty, different score
    const uniqueCount = uniq(dailySubmissions.map(s => s.titleSlug)).length;
    const duplicateCount = dailySubmissions.length - uniqueCount;
    return uniqueCount * 100 + duplicateCount * 20;
}
