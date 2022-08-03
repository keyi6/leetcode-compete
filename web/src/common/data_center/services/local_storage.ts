export class LocalStorage {
    public set<T>(key: string, value: T) {
        if (typeof value === 'string') {
            localStorage.setItem(key, value)
        } else if (typeof value === 'number') {
            localStorage.setItem(key, `${value}`);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    public get(key: string): string | null {
        return localStorage.getItem(key);
    }
}
