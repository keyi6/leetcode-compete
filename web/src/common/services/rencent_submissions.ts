import axios from 'axios';
import { IUser } from '../interfaces';
import { toQuerystring } from '../utils';

export interface ISubmission {
    timestamp: number;
    title: string;
    titleSlug: string;
}

export async function getRecentSubmissions({ username, endpoint}: IUser): Promise<ISubmission[]> {
    const res = await axios.get(`/api/recent-submissions?${toQuerystring({
        u: username,
        ep: endpoint,
    })}`);
    if (res.status !== 200 || !res.data?.data?.recentAcSubmissionList) return Promise.reject(res);
    return res.data.data.recentAcSubmissionList
        .map((s: ISubmission) => ({ ...s, timestamp: s.timestamp * 1000 }));
}
