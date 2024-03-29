import { useGuide } from '../../hooks';
import { Sharing } from './sharing';

export const Home: React.FC = () => {
    useGuide();
    return <Sharing />;
};
