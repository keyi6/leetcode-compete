import { getRecentSubmissions, ISubmission } from './services';
import { ICompetitionInfo, ICompetitionStatus, IUser, IUserDailyStatus } from '../interfaces';
import { DataService } from './data_service';
import { calcDailyScore, calcDailyStatus, equal, getDaysTimestampSince, getMidNightTimestamp, ONE_DAY, userToString } from '../../utils';
import { getCompetition, getMyCompetitions, startCompetition } from './services/competition';
import { BehaviorSubject } from 'rxjs';
import flatten from 'lodash/flatten';
import uniqWith from 'lodash/uniqWith';

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
    /** reading/writing data service instance */
    private service: DataService;
    private submissions$: BehaviorSubject<{ [key: string]: ISubmission[] }> = new BehaviorSubject({});
    private submissionPromise: { [key: string]: Promise<ISubmission[]> } = {};
    private competitions$: BehaviorSubject<ICompetitionInfo[]> = new BehaviorSubject([] as ICompetitionInfo[]);

    private constructor() {
        this.service = new DataService();
        this.initMyCompetitions();
    }

    private async fetchSubmissions(user: IUser) {
        const key = userToString(user);
        const current = this.submissions$.value;
        if (current[key]) return current[key];

        // if submissions are cached, use cached value
        const p = this.submissionPromise[key];
        if (p) return await p;
        // if already posted a request and it have not came back, then wait for it
        this.submissionPromise[key] = getRecentSubmissions(user);
        const submissions = await this.submissionPromise[key];
        delete this.submissionPromise[key];

        current[key] = submissions;
        this.submissions$.next(current);
        return submissions;
    }

    private async initMyCompetitions() {
        const me = await this.getMyUserInfo();
        if (!me) return;
        const competitions = await getMyCompetitions(me);
        this.competitions$.next(competitions);

        const users = uniqWith(flatten(competitions.map(c => c.participants)), equal);
        const watchList = await this.service.getWatchList();
        const newWatchList = uniqWith([...users, ...watchList], equal);
        await this.service.setWatchList(newWatchList);
        newWatchList.forEach(async (user: IUser) => await this.fetchSubmissions(user));
    }

    /**
     * add user to watch list
     * since watch list is private so this info store in local storage
     * @param user
     */
    public async watchUser(user: IUser): Promise<void> {
        const watchList = await this.service.getWatchList();
        if (watchList.find(u => equal(u, user))) return;

        await this.fetchSubmissions(user);
        await this.service.setWatchList([...watchList, user]);
    }

    public async competeUser(user: IUser): Promise<string> {
        const me = await this.service.getMyUserInfo();
        if (!me) return Promise.reject('No local user info found, must set up first.');

        const participants = [me, user];
        const res = await startCompetition(participants);

        if (!res.status) return Promise.reject(res.err);

        this.competitions$.next([...this.competitions$.value, res]);
        await this.fetchSubmissions(user);
        return res.competitionId;
    }

    /**
     * set my user info
     * since my user info is private so this info store in local storage
     * @param user
     */
    public async setMyUserInfo(user: IUser) {
        await this.fetchSubmissions(user);
        await this.watchUser(user);
        await this.service.setMyUserInfo(user);
    }

    public async getMyUserInfo(): Promise<IUser | undefined> {
        return this.service.getMyUserInfo();
    }

    public async getWatchList(): Promise<IUser[]> {
        return this.service.getWatchList();
    }

    public getCompetitions$() {
        return this.competitions$;
    }

    public async getCompetitionStatus(competitionId: string): Promise<ICompetitionStatus | undefined> {
        let competition = this.competitions$.value?.find(c => c.competitionId === competitionId);
        if (!competition) {
            const temp = await getCompetition(competitionId);
            if (!temp?.status) return;
            competition = temp;
        }

        const days = getDaysTimestampSince(competition.startTime);

        const filterDailySubmissions = (ts: number, allSubmissions: ISubmission[]) => 
            allSubmissions.filter(s => ts <= s.timestamp && s.timestamp <= ts + ONE_DAY);
        
        const status = await Promise.all(competition.participants.map(async (user) => {
            const submissions = await this.fetchSubmissions(user);
            const scores = days.map(ts => filterDailySubmissions(ts, submissions)).map(calcDailyScore);
            const totalScore = scores.reduce<number>((prev, cur) => prev + cur, 0);
            return { scores, user, totalScore };
        }));
        const maxScore = Math.max(...(status.map(s => s.totalScore)));
        
        return {
            ...competition,
            status: status.map(s => ({ ...s, isWinning: s.totalScore === maxScore })),
            daysLeft: 7 - Math.floor((getMidNightTimestamp(Date.now()) - competition.startTime) / ONE_DAY),
        };
    }

    public async getUserSubmissions(user: IUser, startTime?: number, endTime?: number): Promise<ISubmission[]> {
        const allSubmissions = await this.fetchSubmissions(user);
        const l = startTime ?? 0;
        const r = endTime ?? Number.MAX_SAFE_INTEGER;
        return allSubmissions
            .filter(s => l <= s.timestamp && s.timestamp <= r);
    }

    public async getUserDailyStatus(user: IUser, timestamp: number): Promise<IUserDailyStatus> {
        const dailySubmissions = await this.getUserSubmissions(user, timestamp, timestamp + ONE_DAY);
        return calcDailyStatus(dailySubmissions);
    }

    public async removeUserFromWatchList(user: IUser) {
        const watchList = (await this.service.getWatchList()).filter(w => !equal(w, user));
        await this.service.setWatchList(watchList);
    }
}
