import React, { useContext, useEffect, useRef } from 'react';
import '../../resources/Player.css'; // Importer le fichier CSS pour le style
import PlayerControls from './PlayerControls';
import PlayerPlaylistCover from './PlayerPlaylistCover';
import PlayerDeezerLogo from './PlayerDeezerLogo';
import { Box, Grid } from '@mui/material';
import { MusicContext } from '../../contexts/MusicContext';

const MusicPlayer = () => {
    
    return (
        <Grid container className="player">
            <Grid item xs={4}>
                <Box className="player-cover">
                    <PlayerPlaylistCover />
                </Box>
            </Grid>
            <Grid item xs={3}>
                <PlayerControls />
            </Grid>
            <Grid item xs={4}>
                <Box className="player-cover">
                    <PlayerDeezerLogo />
                </Box>
            </Grid>
        </Grid>
    );
};

export default MusicPlayer;
