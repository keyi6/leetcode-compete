import { BehaviorSubject } from 'rxjs';
import { userToString } from '../../../utils';
import { ICompetitionInfo, ISubmission, IUser } from '../../interfaces';
import { getCompetition, getMyCompetitions, startCompetition } from '../requests/competition';
import { getRecentSubmissions } from "../requests/recent_submissions";

export class RemoteDataService {
    private submissions$ = new BehaviorSubject<{ [key: string]: ISubmission[] }>({});
    private submissionPromise: { [key: string]: Promise<ISubmission[]> } = {};

    private competitions$ = new BehaviorSubject<ICompetitionInfo[]>([]);

    public async initCompetitions(me: IUser) {
        const competitions = await getMyCompetitions(me);
        this.competitions$.next(competitions);
    }

    public async addCompetition(participants: IUser[]) {
        const res = await startCompetition(participants);
        if (!res.status) return Promise.reject(res.err);
        this.competitions$.next([...this.competitions$.value, res]);
        return res;
    }
    
    public async getUserSubmissions(user: IUser): Promise<ISubmission[]> {
        const key = userToString(user);
        const current = this.submissions$.value;

        // if submissions are cached, use cached value
        if (current[key]) return current[key];

        // if already posted a request and it have not came back, then wait for it
        const p = this.submissionPromise[key];
        if (p) return await p;

        // otherwise, request for it
        this.submissionPromise[key] = getRecentSubmissions(user);
        const submissions = await this.submissionPromise[key];
        delete this.submissionPromise[key];

        // update submission
        current[key] = submissions;
        this.submissions$.next(current);

        return submissions;
    }

    public async getCompetition(id: string): Promise<ICompetitionInfo | undefined> {
        const c = this.competitions$.value?.find(c => c.competitionId === id);
        if (c) return c;

        const r = await getCompetition(id);
        if (!r?.status) return;
        return r;
    }

    public getCompetitions$() {
        return this.competitions$;
    }
}
