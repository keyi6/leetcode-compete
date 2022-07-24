export const ONE_DAY = 1000 * 60 * 60 * 24;

export function getMidNightTimestamp(timestamp: number) {
    return new Date(timestamp)
        .setHours(0, 0, 0, 0)
        .valueOf();
}

/**
 * get past or future days' timestamp array
 * @param daysCount {number} if pass 5, it will return past/future 5 days' timestamps at midnight
 * @param direction {'past'|'future'} default if future
 * @returns in milliseconds
 */
export function getAdjacentDaysTimestamp(
    daysCount: number,
    direction: 'past' | 'future' = 'past',
    startTime = Date.now(),
): number[] {
    const s = getMidNightTimestamp(startTime);
    return new Array(daysCount)
        .fill(0)
        .map((_, index) => (s + index * ONE_DAY * (direction === 'past' ? -1 : 1)));
}


/**
 * get days' timestamp between startTime and now
 * @param startTime in unix timestamps
 * @return in unit timestamps
 */
export function getDaysTimestampSince(startTime: number): number[] {
    let cur = getMidNightTimestamp(startTime);
    const endDay = getMidNightTimestamp(Date.now());

    const arr = [];
    while (cur <= endDay) {
        arr.push(cur);
        cur += ONE_DAY;
    } 
    return arr;
}
