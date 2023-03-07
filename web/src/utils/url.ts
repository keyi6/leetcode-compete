import { Endpoint } from '../common';

export function getLeetcodeUrl(endpoint: Endpoint): string {
    return `https://www.leetcode.${endpoint === Endpoint.CN ? 'cn' : 'com'}`;
}

export function getUserUrl(endpoint: Endpoint, username: string): string {
    return endpoint === Endpoint.CN
        ? `${getLeetcodeUrl(endpoint)}/u/${username}`
        : `${getLeetcodeUrl(endpoint)}/${username}`
}
