import flatten from 'lodash/flatten';
import uniqWith from 'lodash/uniqWith';
import { debounceTime } from 'rxjs';
import {
    calcDailyScore, calcDailyStatus, equal, getDaysTimestampSince, getMidNightTimestamp, ONE_DAY,
} from '../../utils';
import { ICompetitionStatus, ISubmission, IUser, IUserDailyStatus } from '../interfaces';
import { LocalDataService } from './services/local_data_service';
import { RemoteDataService } from './services/remote_data_service';

export class DataCenter {
    // singleton implementation 
    private static instance: DataCenter | null;
    /** get DataCenter singleton */
    public static getInstance(): DataCenter {
        if (!this.instance) {
            this.instance = new DataCenter();
        }
        return this.instance;
    }

    // class members and methods
    /** reading/writing data service in local storage */
    private localData: LocalDataService;
    private remoteData: RemoteDataService;

    private constructor() {
        this.localData = new LocalDataService();
        this.remoteData = new RemoteDataService();

        const subscription = this.localData.getMyUserInfo$()
            .subscribe(async (me) => {
                if (!me) return;
                await this.initMyCompetitions(me);
                subscription.unsubscribe();
            });

        // when competitions is updated, add participants into watch list
        this.remoteData.getCompetitions$()
            .pipe(debounceTime(100))
            .subscribe(async (competitions) => {
                const users = uniqWith(flatten(competitions.map(c => c.participants)), equal);
                const wl = uniqWith([...users, ...(this.localData.getWatchList$().value)], equal);
                this.localData.setWatchList(wl);
            });

        // when watch list update, update submissions
        this.localData.getWatchList$()
            .pipe(debounceTime(100))
            .subscribe(async (wl) => {
                await Promise.all(wl.map(async (u) => await this.remoteData.getUserSubmissions(u)));
            });
    }

    private async initMyCompetitions(me: IUser) {
        await this.remoteData.initCompetitions(me);
    }

    /**
     * add user to watch list
     * since watch list is private so this info store in local storage
     * @param user
     */
    public async watchUser(user: IUser): Promise<void> {
        this.localData.addToWatchList(user);
    }

    /**
     * remove user from watch list
     */
    public unwatchUser(user: IUser) {
        this.localData.removeFromWatchList(user);
    }
    
    /**
     * start a competition with a user
     * @param user
     * @returns competitionId
     */
    public async competeUser(user: IUser): Promise<string> {
        const me = this.localData.getMyUserInfo$().value;
        if (!me) return Promise.reject('No local user info found, must set up first.');

        const res = await this.remoteData.addCompetition([me, user]);
        return res.competitionId;
    }

    /**
     * set my user info
     * since my user info is private so this info store in local storage
     * @param user
     */
    public setMyUserInfo(user: IUser) {
        this.localData.setMyUserInfo(user);
    }

    public getMyUserInfo$() {
        return this.localData.getMyUserInfo$().asObservable();
    }

    public getWatchList$() {
        return this.localData.getWatchList$().asObservable();
    }

    public getCompetitions$() {
        return this.remoteData.getCompetitions$().asObservable();
    }

    /**
     * calc competition status
     * @param competitionId
     */
    public async getCompetitionStatus(competitionId: string): Promise<ICompetitionStatus | undefined> {
        const competition = await this.remoteData.getCompetition(competitionId);
        if (!competition) return;

        const days = getDaysTimestampSince(competition.startTime);

        const filterDailySubmissions = (ts: number, allSubmissions: ISubmission[]) => 
            allSubmissions.filter(s => ts <= s.timestamp && s.timestamp <= ts + ONE_DAY);
        
        const status = await Promise.all(competition.participants.map(async (user) => {
            const submissions = await this.remoteData.getUserSubmissions(user);
            const scores = days.map(ts => filterDailySubmissions(ts, submissions)).map(calcDailyScore);
            const totalScore = scores.reduce<number>((prev, cur) => prev + cur, 0);
            return { scores, user, totalScore };
        }));

        const maxScore = Math.max(...(status.map(s => s.totalScore)));
        return {
            ...competition,
            status: status.map(s => ({
                ...s,
                isWinning: s.totalScore === maxScore,
            })),
            daysLeft: 7 - Math.floor((getMidNightTimestamp(Date.now()) - competition.startTime) / ONE_DAY),
        };
    }

    public async getUserSubmissions(user: IUser, startTime?: number, endTime?: number): Promise<ISubmission[]> {
        const allSubmissions = await this.remoteData.getUserSubmissions(user);
        const l = startTime ?? 0;
        const r = endTime ?? Number.MAX_SAFE_INTEGER;
        return allSubmissions
            .filter(s => l <= s.timestamp && s.timestamp <= r);
    }

    public async getUserDailyStatus(user: IUser, timestamp: number): Promise<IUserDailyStatus> {
        const dailySubmissions = await this.getUserSubmissions(user, timestamp, timestamp + ONE_DAY);
        return calcDailyStatus(dailySubmissions);
    }
}
