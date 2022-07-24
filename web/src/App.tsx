import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Router } from './pages';
import { Color } from './common';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: Color.GREEN,
        },
        secondary: {
            main: Color.RED,
        },
    },
});

export const App = () => (
    <ThemeProvider theme={theme}>
        <Router />
    </ThemeProvider>
);
