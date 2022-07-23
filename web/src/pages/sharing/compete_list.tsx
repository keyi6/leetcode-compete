import { IUser } from '../../common';

export interface ICompeteListProps {
    competeList: IUser[];
}

export const CompeteList: React.FC<ICompeteListProps> = (props: ICompeteListProps) => {
    return (
        <ul>
            <p>compete list</p>
            {props.competeList.map(({ username, endpoint }) => (<li>username: {username}, endpoint: {endpoint}</li>))}
        </ul>
    );
}
