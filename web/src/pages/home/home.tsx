import { useGuide } from '../../common/';
import { Sharing } from './sharing';

export const Home: React.FC = () => {
    useGuide();
    return <Sharing />;
};
