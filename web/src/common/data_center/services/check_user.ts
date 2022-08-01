import axios, { AxiosError } from 'axios';
import { IUser } from '../../interfaces';

export async function checkUser(user: IUser): Promise<void> {
    try {
        const res = await axios.post<{
            status?: boolean;
            err?: string;
        }>('/api/check-user', user);
    
        if (!res.data.status) return Promise.reject(res.data.err);
    } catch (e) {
        let err = JSON.stringify(e);
        if (e instanceof AxiosError) err = e.response?.data?.err || e.message;

        return Promise.reject(err);
    }
}
