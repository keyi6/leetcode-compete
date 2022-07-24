import Fab from '@mui/material/Fab';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Link } from 'react-router-dom';

export const Add: React.FC = () => (
    <Link to='/add'>
        <Fab aria-label="add" color="primary" style={{ color: '#fff', position: 'fixed', right: 40, bottom: 40 }}>
            <PersonAddAlt1Icon />
        </Fab>
    </Link>
);
