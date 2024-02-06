import React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { List, Box, IconButton, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaylistOverview from './PlaylistOverview';
import PlaylistItem from './PlaylistItem';

const fetcher = (url) => fetch(url).then((res) => res.json());

function PlaylistDetail() {
    const { id } = useParams();
    const { data, error } = useSWR(`http://localhost:8080/playlist/${id}`, fetcher);

    if (error) return <div>Couldn't load playlist.</div>
    if (!data) return <div>Loading...</div>

    const created_at = new Date(data.creation_date).getFullYear()
    const duration = Math.floor(data.duration / 60) + ' minutes'

    return (
        <Grid item xs={9}>
            <div className='container'>
                <Box>                
                    <Link to="/">
                        <IconButton>
                            <ArrowBackIcon />
                        </IconButton>
                        Back to Playlists
                    </Link>
                </Box>
                <PlaylistOverview
                    img={data.picture_xl}
                    title={data.title}
                    creator={data.creator.name}
                    created_at={created_at}
                    countSongs={data.tracks.data.length}
                    duration={duration}
                />
                <List>
                    {
                        data.tracks.data.map((track, index) => (
                            <PlaylistItem
                                track={track}
                                key={index}
                            />
                        ))
                    }
                </List>
            </div>
        </Grid>
    );
}

export default PlaylistDetail;

