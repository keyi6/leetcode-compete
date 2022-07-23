import { IUser } from '../../common';

export interface IWatchListProps {
    watchList: IUser[];
}

export const WatchList: React.FC<IWatchListProps> = (props: IWatchListProps) => {
    return (
        <ul>
            <p>watch list</p>
            {props.watchList.map(({ username, endpoint }) => (<li key={`watch-list-${username}-${endpoint}`}>{username}@{endpoint}</li>))}
        </ul>
    );
}
