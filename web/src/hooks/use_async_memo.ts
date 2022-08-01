import { useEffect, useState } from 'react';

export function useAsyncMemo<T>(
    callback: () => Promise<T>,
    defaultValue: T,
    deps: React.DependencyList = [],
): T {
    const [v, setV] = useState<T>(defaultValue);
    useEffect(() => {
        callback().then(setV);
    }, deps);
    return v;
}
