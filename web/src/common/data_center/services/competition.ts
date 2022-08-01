import axios, { AxiosError } from 'axios';
import { ICompetitionInfo, IUser } from '../../interfaces';

function formatTime<T extends { startTime: number; endTime: number; }>(obj: T): T {
    return {
        ...obj,
        startTime: obj.startTime * 1000,
        endTime: obj.endTime * 1000,
    };
}

type ICompetitionResponse = (ICompetitionInfo & { status: boolean; err?: string })
    | { status: false; err: string };

export async function startCompetition(participants: IUser[]): Promise<ICompetitionResponse> {
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

        return res.data.competitions;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function getCompetition(competitionId: string): Promise<ICompetitionResponse> {
    try {
        const res = await axios.post<ICompetitionInfo & { status: boolean }>('/api/query-competition', {
            competitionId,
        });
        return res.data;
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


