import { getRecentSubmissions, ISubmission } from '../services';
import { ICompetitionInfo, ICompetitionStatus, IUser, IUserDailyStatus } from '../interfaces';
import { DataService } from './data_service';
import unionWith from 'lodash/unionWith';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';
import { calcDailyScore, equal, getDaysTimestampSince, getMidNightTimestamp, ONE_DAY, userToString } from '../utils';
import { getMyCompetitions, startCompetition } from '../services/competition';

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
    private submissions: { [key: string]: ISubmission[] } = {};
    private competitions: ICompetitionInfo[] = [];

    private constructor() {
        this.service = new DataService();
        // this.updateAllUsersSubmissions();
        this.fetchMyCompetitions();
    }

    private async fetchSubmissions(user: IUser) {
        const k = userToString(user);
        if (this.submissions[k]) return;
        this.submissions[k] = await getRecentSubmissions(user);
    }

    private async fetchMyCompetitions() {
        const me = await this.getMyUserInfo();
        if (!me) return;
        this.competitions = await getMyCompetitions(me);
    }

    private async updateAllUsersSubmissions() {
        const watchList = await this.service.getWatchList();
        const competeList = (await this.service.getCompeteList()).map(c => c.participants);
        unionWith(watchList, flatten(competeList), isEqual)
            .filter(u => !!u)
            .forEach(async (user: IUser) => await this.fetchSubmissions(user));
    }

    /**
     * add user to watch list
     * since watch list is private so this info store in local storage
     * @param user
     */
    public async watchUser(user: IUser): Promise<void> {
        const watchList = await this.service.getWatchList();
        if (watchList.find(u => u.username === user.username && u.endpoint === user.endpoint)) return;

        await this.fetchSubmissions(user);
        await this.service.setWatchList([...watchList, user]);
    }

    public async competeUser(user: IUser): Promise<void> {
        const me = await this.service.getMyUserInfo();
        if (!me) return Promise.reject('No local user info found, must set up first.');

        const participants = [me, user];
        const res = await startCompetition(participants);

        if (!res.status) return Promise.reject(res.err);

        this.competitions.push(res);
        await this.fetchSubmissions(user);
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

    public async getCompeteList(): Promise<ICompetitionInfo[]> {
        return this.competitions;
    }

    public async getCompetitionStatus(competitionId: string): Promise<ICompetitionStatus | undefined> {
        const allCompetitions = await this.service.getCompeteList();
        const competition = allCompetitions.find(c => c.competitionId === competitionId);
        if (!competition) return;

        const days = getDaysTimestampSince(competition.startTime);

        const filterDailySubmissions = (ts: number, allSubmissions: ISubmission[]) => 
            allSubmissions.filter(s => ts <= s.timestamp && s.timestamp <= ts + ONE_DAY);
        
        const status = await Promise.all(competition.participants.map(async (user) => {
            const submissions = await this.service.getUserSubmissions(user);
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

    public async getUserDailyStatus(user: IUser, timestamp: number): Promise<IUserDailyStatus> {
        const allSubmissions = await this.service.getUserSubmissions(user);
        const q = allSubmissions
            .filter(s => timestamp <= s.timestamp && s.timestamp <= timestamp + ONE_DAY)
            .map(s => s.titleSlug);
        const count = uniq(q).length;

        const goal = 5;
        const percentage = Math.round(count / goal * 100);
        return {
            percentage,
            count,
            goal,
        };
    }

    public async removeUserFromWatchList(user: IUser) {
        const watchList = (await this.service.getWatchList()).filter(w => !equal(w, user));
        await this.service.setWatchList(watchList);
    }
}
