import { IUser } from "../interfaces";

export function userToString(user: IUser): string {
    return `${user.username}${user.endpoint}` ;
}

export function equal(user1: IUser, user2: IUser): boolean {
    return user1.username === user2.username && user1.endpoint === user2.endpoint;
}
