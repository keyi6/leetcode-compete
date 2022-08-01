import axios from 'axios';
import { Difficulty } from '../../constants';
import { IUser } from '../../interfaces';

export interface ISubmission {
    timestamp: number;
    title: string;
    titleSlug: string;
    difficulty: Difficulty;
}

export async function getRecentSubmissions(user: IUser): Promise<ISubmission[]> {
    try {
        const res = await axios.post<{
            submissions: ISubmission[];
        }>('/api/query-recent-submissions', user);
        return res.data.submissions
            .map((s: ISubmission) => ({ ...s, timestamp: s.timestamp * 1000 }));
    } catch(err) {
        console.error(err);
        return [];
    }
}
