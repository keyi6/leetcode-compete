import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from './local_storage';
import { IUser } from '../../interfaces';
import { equal, isUser } from '../../../utils';

export enum StorageKey {
    MY_USER_INFO = 'my_user_info',
    WATCH_LIST = 'watch_list',
}


export class LocalDataService {
    private storage: LocalStorage = new LocalStorage();

    private watchList$ = new BehaviorSubject<IUser[]>([]); 
    private myInfo$ = new BehaviorSubject<IUser | undefined>(undefined);

    constructor() {
        this.initMyInfo();
        this.initWatchList();
    }

    private initWatchList() {
        const v = this.storage.get(StorageKey.WATCH_LIST); 
        if (!v) return;
        try {
            const wl =  JSON.parse(v);
            this.watchList$.next(wl.filter((u: any) => isUser(u)));
        } catch(err) {
            console.error(err);
        }
    }

    private initMyInfo() {
        const v = this.storage.get(StorageKey.MY_USER_INFO);
        if (!v) return;
        try {
            const u = JSON.parse(v);
            if (isUser(u)) this.myInfo$.next(u);
        } catch(err) {
            console.error(err);
        }
    }

    public setWatchList(wl: IUser[]) {
        this.storage.set(StorageKey.WATCH_LIST, wl); 
        this.watchList$.next(wl);
    }

    public addToWatchList(u: IUser) {
        const wl = this.watchList$.value;
        if (wl.find(wu => equal(wu, u))) return;
        this.setWatchList([...wl, u]);
    }

    public removeFromWatchList(u: IUser) {
        this.setWatchList(this.watchList$.value.filter(wu => !equal(wu, u)));
    }


    public getWatchList$() {
        return this.watchList$;
    }

    public setMyUserInfo(u: IUser): void {
        this.storage.set(StorageKey.MY_USER_INFO, u)
        this.myInfo$.next(u);
    }

    public getMyUserInfo$() {
        return this.myInfo$;
    }
}
