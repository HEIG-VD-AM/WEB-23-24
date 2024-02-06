import React from 'react';
import CoverList from './CoverList';
import { Grid } from '@mui/material';

function HomePage() {

    return (
        <Grid item xs={9}>
            <div className="container">
                <h1>Playlists</h1>
                <CoverList />
            </div>
        </Grid>
    );
}

export default HomePage;
