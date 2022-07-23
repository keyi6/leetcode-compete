import { useEffect, useState } from 'react';

export function useAsyncMemo<T>(callback: () => Promise<T>, defaultValue: T): T {
    const [v, setV] = useState<T>(defaultValue);
    useEffect(() => {
        callback().then(setV);
    }, []);
    return v;
}
