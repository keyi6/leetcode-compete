import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { VerticalFlex } from '../components';

export const Guide: React.FC = () => {
    const nav = useNavigate();
    return (
        <VerticalFlex>
            <h1>Welcome to Leetcode-Compete</h1>
            <Alert severity="warning">
                This page will use localstorage to save data. All it needs is usernames. No password required.
            </Alert>

            <Button onClick={() => nav('/setup')} variant="contained" style={{ margin: '30px 0 20px 0'}}>Go Setup</Button>
            <Button onClick={() => nav('/rules')} variant="outlined">View Rules</Button>
        </VerticalFlex>
    )
};
