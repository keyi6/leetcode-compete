import { Endpoint } from '../common';

export function getLeetcodeUrl(endpoint: Endpoint): string {
    return `https://www.leetcode.${endpoint === Endpoint.CN ? 'cn' : 'com'}`;
}
