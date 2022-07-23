export const ONE_DAY = 1000 * 60 * 60 * 24;

export function getMidNightTimestamp(timestamp: number) {
    return new Date(timestamp)
        .setHours(0, 0, 0, 0)
        .valueOf();
}

/**
 * get past days' timestamp array
 * @param pastDaysCount {number} if pass 5, it will return past 5 days' timestamps at midnight
 * @returns in milliseconds
 */
export function getPastDaysTimestamp(pastDaysCount: number): number[] {
    const today = getMidNightTimestamp(Date.now());
    return new Array(pastDaysCount)
        .fill(0)
        .map((_, index) => (today - index * ONE_DAY));
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
