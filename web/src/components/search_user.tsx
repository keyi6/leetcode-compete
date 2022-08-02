import React, { useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import { HorizontalFlex, VerticalFlex } from './flex';
import { Endpoint, IUser, checkUser } from '../common';
import { getLeetcodeUrl } from '../utils';

export interface IUserProps {
    buttonWording?: string;
    onClick: (userInfo: IUser) => Promise<void>;
}

export const SearchUser: React.FC<IUserProps> = (props) => {
    const [username, setUsername] = useState<string>('');
    const [endpoint, setEndpoint] = useState<Endpoint>(Endpoint.CN);
    const link = useMemo(
        () => `${getLeetcodeUrl(endpoint)}/u/${username}`,
        [username, endpoint],
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<string>('');

    const handleClick = async () => {
        setLoading(true);
        const user = { username, endpoint };
        try {
            await checkUser(user);
            await props.onClick(user);
        } catch (err) {
            if (typeof(err) === 'string') setErr(err);
            else setErr(JSON.stringify(err));
        }
        setLoading(false);
    };

    return (
        <VerticalFlex style={{ gap: 30 }}>
            <HorizontalFlex style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <TextField id="username" label="username" variant="standard" 
                    value={username} onChange={(e) => setUsername(e.target.value)}
                    style={{ flexGrow: 1, marginRight: 20 }} />

                <Select id="endpoint-select" label="Endpoint" variant="standard"
                    value={endpoint} onChange={(e) => setEndpoint(e.target.value as Endpoint)}>
                    <MenuItem value={Endpoint.CN}>leetcode.cn</MenuItem>
                    <MenuItem value={Endpoint.US}>leetcode.com</MenuItem>
                </Select>
            </HorizontalFlex>

            {username && (
                <div>
                    <p>Please check if the link below is the profile you want to link.</p>
                    <Link href={link} target="_blank">{link}</Link>
                </div>
            )}

            <LoadingButton variant="contained" disabled={!username} onClick={handleClick} loading={loading}>
                {props.buttonWording || 'Add to watch list'}
            </LoadingButton>

            {err && 
                <Alert severity="error">
                    Failed to fetch user info from <Link href={link} target="_blank">{link}</Link>. Please check again. Detail: {err}
                </Alert>
            }
        </VerticalFlex>
    );
};
