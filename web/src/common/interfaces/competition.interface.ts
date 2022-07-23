import { IUser } from './user.interface';

export interface ICompetitionInfo {
    competitionId: string;
    startTime: number;
    me: IUser;
    opponent: IUser;
}

export interface ICompetitionStatus extends ICompetitionInfo {
    daysLeft: number;
    myScores: number[];
    opponentsScores: number[];
}
