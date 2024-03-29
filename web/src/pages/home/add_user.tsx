import { Link } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export const AddUser: React.FC = () => (
    <Link to='/add'>
        <Fab aria-label="add" color="primary" style={{ color: '#fff', position: 'fixed', right: 40, bottom: 40 }}>
            <PersonAddAlt1Icon />
        </Fab>
    </Link>
);
