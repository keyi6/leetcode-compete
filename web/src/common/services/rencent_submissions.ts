import axios from 'axios';
import { IUser } from '../interfaces';
import { toQuerystring } from '../utils';

export interface ISubmission {
    timestamp: number;
    title: string;
    titleSlug: string;
}

const HOST = 'https://leetcode-compete.keyi-li.com/api';

export async function getRecentSubmissions(user: IUser): Promise<ISubmission[]> {
    // TODO: remove debug code
    return Promise.resolve([]);
    const res = await axios.get(`${HOST}/recent-submissions?${toQuerystring(user)}`);
    if (res.status !== 200 || !res.data?.data?.recentAcSubmissionList) return Promise.reject(res);
    return res.data.data.recentAcSubmissionList
        .map((s: ISubmission) => ({ ...s, timestamp: s.timestamp * 1000 }));
}
