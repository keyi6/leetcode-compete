import axios from 'axios';
import { IUser } from '../interfaces';

export async function checkUser({ username, endpoint}: IUser): Promise<void> {
    const res = await axios.post('/api/check-user', {
        username,
        endpoint,
    });

    if (!res.data.status) {
        return Promise.reject(res.data.err);
    }
}
