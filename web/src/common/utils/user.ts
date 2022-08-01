import { Endpoint } from "../constants";
import { IUser } from "../interfaces";

export function userToString(user: IUser): string {
    return `${user.username}${user.endpoint}` ;
}

export function equal(user1: IUser, user2: IUser): boolean {
    return user1.username === user2.username && user1.endpoint === user2.endpoint;
}

export function isUser(u: any): u is IUser {
    if (!u) return false;
    return (u['username'] && Object.values(Endpoint).includes(u['endpoint']));
}
