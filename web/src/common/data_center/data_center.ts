import { getRecentSubmissions } from '../services';
import { IUser } from '../user.interface';
import { DataService } from './data_service';
import union from 'lodash/union';

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
        await this.service.setUserSubmissions(user, union(prevSubmissions, submissions));
    }

    private async updateAllUsersSubmissions() {
        const watchList = await this.service.getWatchList();
        const competeList = await this.service.getCompeteList();
        union(watchList, competeList).forEach(async (user: IUser) => await this.updateSubmissions(user));
    }

    public async addUserToWatchList(user: IUser) {
        const watchList = await this.service.getWatchList();
        if (watchList.find(u => u.username === user.username && u.endpoint === user.endpoint)) return;

        await this.updateSubmissions(user);
        await this.service.setWatchList([...watchList, user]);
    }

    public async addUserToCompeteList(user: IUser) {
        const watchList = await this.service.getCompeteList();
        if (watchList.find(u => u.username === user.username && u.endpoint === user.endpoint)) return;

        await this.updateSubmissions(user);
        await this.service.setWatchList([...watchList, user]);
    }

    public async setMyUserInfo(user: IUser) {
        await this.updateSubmissions(user);
        await this.service.setMyUserInfo(user);
    }

    public async getWatchList(): Promise<IUser[]> {
        return this.service.getWatchList();
    }

    public async getCompeteList(): Promise<IUser[]> {
        return this.service.getCompeteList();
    }
}
