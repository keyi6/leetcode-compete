import axios from 'axios';
import { IUser } from '../interfaces';

export interface ISubmission {
    timestamp: number;
    title: string;
    titleSlug: string;
}

export async function getRecentSubmissions({ username, endpoint }: IUser): Promise<ISubmission[]> {
    return axios.get(`https://leetcode-compete.keyi-li.com/api/recent-submissions?u=${username}&ep=${endpoint}`);
}
