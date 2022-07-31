import { IUser } from './user.interface';

export interface ICompetitionInfo {
    competitionId: string;
    startTime: number;
    participants: IUser[];
}

export interface ICompetitionStatus extends ICompetitionInfo {
    daysLeft: number;
    status: ({
        user: IUser;
        scores: number[];
        totalScore: number;
        isWinning: boolean;
    })[];
}
