import { StorageKey } from './storage_key';
import { ISubmission } from '../services';
import { IStorage, LocalStorage } from './storage';
import { IUser } from '../interfaces';

export class DataService {
    private storage: IStorage;

    constructor() {
        this.storage = new LocalStorage();
    }

    public async setWatchList(users: IUser[]): Promise<void> {
        return this.storage.set(StorageKey.WATCH_LIST, users); 
    }

    public async getWatchList(): Promise<IUser[]> {
        const v = await this.storage.get(StorageKey.WATCH_LIST); 
        return JSON.parse(v || '[]') as IUser[];
    }

    public async setCompeteList(users: IUser[]): Promise<void> {
        return this.storage.set(StorageKey.COMPETE_LIST, users);
    }

    public async getCompeteList(): Promise<IUser[]> {
        const v = await this.storage.get(StorageKey.COMPETE_LIST); 
        return JSON.parse(v || '[]') as IUser[];
    }

    public async setMyUserInfo(user: IUser): Promise<void> {
        return this.storage.set(StorageKey.MY_USER_INFO, user)
    }

    public async getMyUserInfo(): Promise<IUser> {
        const v = await this.storage.get(StorageKey.MY_USER_INFO);
        return JSON.parse(v || '{}') as IUser;
    }

    public async setUserSubmissions(user: IUser, submissions: ISubmission[]): Promise<void> {
        return this.storage.set(`${StorageKey.SUBMISSIONS}_${user.username}_${user.endpoint}`, submissions);
    }

    public async getUserSubmissions(user: IUser): Promise<ISubmission[]> {
        const v = await this.storage.get(`${StorageKey.SUBMISSIONS}_${user.username}_${user.endpoint}`);
        return JSON.parse(v || '[]') as ISubmission[];
    }
}
