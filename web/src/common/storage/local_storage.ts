import { IStorage } from './storage.interface';

export class LocalStorage implements IStorage {
    public set<T>(key: string, value: T): Promise<void> {
        if (typeof value === 'string') {
            localStorage.setItem(key, value)
        } else if (typeof value === 'number') {
            localStorage.setItem(key, `${value}`);
        } else {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.resolve();
    }

    public get(key: string): Promise<string | null> {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
    }
}
