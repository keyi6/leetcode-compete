import { Card, CardList, IUser } from '../../common';

export interface ICompeteListProps {
    competeList: IUser[];
}

export const CompeteList: React.FC<ICompeteListProps> = (props: ICompeteListProps) => {
    return (
        <CardList>
            <h2>competitions</h2>

            {props.competeList.map(({ username, endpoint }) => (
                <Card>
                    username: {username}, endpoint: {endpoint}
                </Card>
            ))}
        </CardList>
    );
}
