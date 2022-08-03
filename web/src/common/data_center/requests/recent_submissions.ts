import axios from 'axios';
import { ISubmission, IUser } from '../../interfaces';


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
