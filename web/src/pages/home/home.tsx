import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { DataCenter, useAsyncMemo, VerticalFlex } from '../../common';
import { Sharing } from './sharing';

const Guide: React.FC = () => {
    const nav = useNavigate();
    return (
        <VerticalFlex>
            <h1>Welcome to Leetcode-Compete</h1>
            <Alert severity="info" style={{ marginBottom: 30 }}>
                This page will use localstorage to save data. All it needs is usernames. No password required.
            </Alert>
            <Button onClick={() => nav('/setup')} variant="contained">Go Setup</Button>
        </VerticalFlex>
    )
};

export const Home: React.FC = () => {
    const user = useAsyncMemo(async () => await DataCenter.getInstance().getMyUserInfo(), undefined);

    return user?.username
        ? <Sharing />
        : <Guide />;
};
