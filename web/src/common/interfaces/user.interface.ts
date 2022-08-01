import { Endpoint } from '../constants';

export interface IUser {
    endpoint: Endpoint;
    username: string;
}

export interface IUserDailyStatus {
    percentage: [number, number, number];
    count: number;
    goal: number;
}