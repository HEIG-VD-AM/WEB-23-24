import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import PlaylistDetail from './components/Playlist/PlaylistDetail';
import Player from './components/Player/Player';
import MusicContextProvider from './contexts/MusicContext';
import { CssBaseline, Grid } from '@mui/material';
import Queue from './components/Queue';

function App() {
    return (
        <MusicContextProvider>
            <CssBaseline />
            <Router>
                <Grid container>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/playlist/:id" element={<PlaylistDetail />} />
                    </Routes>
                    <Queue/>
                </Grid>
                <Player />
            </Router>
        </MusicContextProvider>
    );
}

export default App;
