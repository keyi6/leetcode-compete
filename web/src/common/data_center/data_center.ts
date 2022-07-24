import { getRecentSubmissions, ISubmission } from '../services';
import { ICompetitionInfo, ICompetitionStatus, IUser, IUserDailyStatus } from '../interfaces';
import { DataService } from './data_service';
import unionWith from 'lodash/unionWith';
import isEqual from 'lodash/isEqual';
import { calcDailyScore, getDaysTimestampSince, getMidNightTimestamp, ONE_DAY } from '../utils';
import { uniq } from 'lodash';

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

    private constructor() {
        this.service = new DataService();
        this.updateAllUsersSubmissions();
    }

    private async updateSubmissions(user: IUser) {
        const submissions = await getRecentSubmissions(user);
        if (!submissions) return;

        const prevSubmissions = await this.service.getUserSubmissions(user);
        await this.service.setUserSubmissions(user, unionWith(prevSubmissions, submissions, isEqual));
    }

    private async updateAllUsersSubmissions() {
        const watchList = await this.service.getWatchList();
        const competeList = (await this.service.getCompeteList()).map(c => c.opponent);
        unionWith(watchList, competeList, isEqual)
            .filter(u => !!u)
            .forEach(async (user: IUser) => await this.updateSubmissions(user));
    }

    public async addUserToWatchList(user: IUser) {
        const watchList = await this.service.getWatchList();
        if (watchList.find(u => u.username === user.username && u.endpoint === user.endpoint)) return;

        await this.updateSubmissions(user);
        await this.service.setWatchList([...watchList, user]);
    }

    public async addUserToCompeteList(user: IUser): Promise<void> {
        const competeList = await this.service.getCompeteList();
        // if opponent is already in a competition, ignore
        if (competeList.find(u => u.opponent.username === user.username && u.opponent.endpoint === user.endpoint)) {
            return;
        }

        await this.updateSubmissions(user);
        const me = await this.service.getMyUserInfo();

        await this.service.setCompeteList([...competeList, {
            opponent: user,
            me, 
            startTime: getMidNightTimestamp(Date.now() + ONE_DAY),
            competitionId: Math.random().toString(36).substring(2, 10),
        }]);
    }

    public async setMyUserInfo(user: IUser) {
        await this.updateSubmissions(user);
        await this.service.setMyUserInfo(user);
    }

    public async getWatchList(): Promise<IUser[]> {
        return this.service.getWatchList();
    }

    public async getCompeteList(): Promise<ICompetitionInfo[]> {
        return this.service.getCompeteList();
    }

    public async getGoal() {
        // TODO: read it from local storage or whatever
        return Promise.resolve(5);
    }

    public async getCompetitionStatus(competitionId: string): Promise<ICompetitionStatus | undefined> {
        const allCompetitions = await this.service.getCompeteList();
        const competition = allCompetitions.find(c => c.competitionId === competitionId);
        if (!competition) return;

        const mySubmissions = await this.service.getUserSubmissions(competition.me);
        const opponentsSubmissions = await this.service.getUserSubmissions(competition.opponent);
        const days = getDaysTimestampSince(competition.startTime);

        const filterDailySubmissions = (ts: number, allSubmissions: ISubmission[]) => 
            allSubmissions.filter(s => ts <= s.timestamp && s.timestamp <= ts + ONE_DAY);

        const myScores = days.map(ts => filterDailySubmissions(ts, mySubmissions))
            .map(calcDailyScore);
        const opponentsScores = days.map(ts => filterDailySubmissions(ts, opponentsSubmissions))
            .map(calcDailyScore);
        
        return {
            ...competition,
            myScores,
            opponentsScores,
            daysLeft: Math.floor((getMidNightTimestamp(Date.now()) - competition.startTime) / ONE_DAY),
        };
    }

    public async getUserDailyStatus(user: IUser, timestamp: number): Promise<IUserDailyStatus> {
        const allSubmissions = await this.service.getUserSubmissions(user);
        const q = allSubmissions
            .filter(s => timestamp <= s.timestamp && s.timestamp <= timestamp + ONE_DAY)
            .map(s => s.titleSlug);
        const count = uniq(q).length;

        const goal = await this.getGoal();
        const percentage = Math.round(count / goal * 100);
        return {
            percentage,
            count,
            goal,
        };
    }
}
