export interface IStorage {
    set<T>(key: string, value: T): Promise<void>;
    get(key: string): Promise<string | null>;
}
