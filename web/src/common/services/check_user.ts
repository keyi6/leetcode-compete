import axios from 'axios';
import { IUser } from '../interfaces';

export async function checkUser(user: IUser): Promise<void> {
    const res = await axios.post<{
        status?: boolean;
        err?: string;
    }>('/api/check-user', user);

    if (!res.data.status) {
        return Promise.reject(res.data.err);
    }
}
