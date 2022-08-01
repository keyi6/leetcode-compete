import axios, { AxiosError } from 'axios';
import { ICompetitionInfo, IUser } from '../interfaces';

type IStartCompetitionResponse = (ICompetitionInfo & { status: boolean; err?: string })
    | { status: false; err: string };

export async function startCompetition(participants: IUser[]): Promise<IStartCompetitionResponse> {
    try {
        const res = await axios.post<Promise<ICompetitionInfo & { status: boolean }>>('/api/start-competition', {
            participants,
        });

        return {
            ...res.data,
            participants,
        }
    } catch(e) {
        let err = JSON.stringify(e);
        if (e instanceof AxiosError) err = e.response?.data?.err || e.message;

        console.error(err);

        return {
            status: false,
            err: err || JSON.stringify(e),
        };
    }
}


export async function getMyCompetitions(me: IUser): Promise<ICompetitionInfo[]> {
    try {
        const res = await axios.post<{
            competitions: ICompetitionInfo[];
        }>('/api/query-my-competitions', me);

        return res.data.competitions;
    } catch(err) {
        console.error(err);
        return [];
    }
}

