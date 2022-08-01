import { StorageKey } from './storage_key';
import { IStorage, LocalStorage } from './storage';
import { IUser } from '../interfaces';
import { isUser } from '../../utils';

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
        if (!v) return [];
        try {
            const wl =  JSON.parse(v);

            return wl.filter((u: any) => isUser(u))
        } catch(err) {
            console.error(err);
        }
        return [];
    }

    public async setMyUserInfo(user: IUser): Promise<void> {
        return this.storage.set(StorageKey.MY_USER_INFO, user)
    }

    public async getMyUserInfo(): Promise<IUser | undefined> {
        const v = await this.storage.get(StorageKey.MY_USER_INFO);
        if (!v) return;
        try {
            const u = JSON.parse(v);
            if (isUser(u)) return u;
        } catch(err) {
            console.error(err);
        }
    }
}
