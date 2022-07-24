import { useNavigate } from 'react-router-dom';
import { DataCenter, IUser, SearchUser, VerticalFlex } from '../../common';

export const Setup: React.FC = () => {
    const nav = useNavigate();
    const setMyInfo = async (user: IUser) => {
        await DataCenter.getInstance().setMyUserInfo(user);
        nav('/');
    };

    return (
        <VerticalFlex>
            <h2>First, setup your leetcode username</h2>
            <SearchUser onClick={setMyInfo} buttonWording={'yes, this is me'} />
        </VerticalFlex>
    );
};
