import axios, { AxiosError } from 'axios';
import { ICompetitionInfo, IUser } from '../interfaces';

function formatTime<T extends { startTime: number; endTime: number; }>(obj: T): T {
    return {
        ...obj,
        startTime: obj.startTime * 1000,
        endTime: obj.endTime * 1000,
    };
}

type IStartCompetitionResponse = (ICompetitionInfo & { status: boolean; err?: string })
    | { status: false; err: string };

export async function startCompetition(participants: IUser[]): Promise<IStartCompetitionResponse> {
    try {
        const res = await axios.post<ICompetitionInfo & { status: boolean }>('/api/start-competition', {
            participants,
        });

        return {
            ...formatTime(res.data),
            participants,
        }
    } catch (e) {
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

        return res.data.competitions.map(formatTime);
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function getCompetition(competitionId: string): Promise<ICompetitionInfo | undefined> {
    try {
        const res = await axios.post<ICompetitionInfo>('/api/query-competition', {
            competitionId,
        });

        return formatTime(res.data);
    } catch (err) {
        console.error(err);
        return;
    }
}


