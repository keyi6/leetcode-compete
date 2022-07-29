import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { VerticalFlex } from '../../common';

export const Guide: React.FC = () => {
    const nav = useNavigate();
    return (
        <VerticalFlex>
            <h1>Welcome to Leetcode-Compete</h1>
            <Alert severity="warning" style={{ marginBottom: 30 }}>
                This page will use localstorage to save data. All it needs is usernames. No password required.
            </Alert>
            <Button onClick={() => nav('/setup')} variant="contained">Go Setup</Button>
        </VerticalFlex>
    )
};
