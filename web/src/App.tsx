import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Router } from './pages';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#48e101',
        },
    },
});

export function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Router />
        </ThemeProvider>
    );
}
