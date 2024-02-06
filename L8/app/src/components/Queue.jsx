import { Container, Grid, List, ListItem } from '@mui/material';
import React, { useContext } from 'react';
import InfoText from './Typography/InfoText';
import { MusicContext } from '../contexts/MusicContext';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

function Queue() {

    const { music, dispatch } = useContext(MusicContext);
    const { current, state, queue } = music;

    return (
        <Grid item xs={3}>
            <Container sx={{
                backgroundColor: '#eee',
                position: 'fixed',
                height: '100%',
                borderLeft: '1px solid #ccc',
            }}>
                <InfoText sx={{paddingTop: "1em"}}>Queue &#183; {music.queue.length} song{music.queue.length >0 ? "s" : ""}</InfoText>
                {music.queue.map((track, index) => (
                    <List key={index}>
                        <ListItem divider>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <div>
                                    {(current?.id === track.id) && <PlayCircleOutlineIcon className='overlay-play' />}
                                    <img src={track.album.cover_small} alt={track.title} style={{ marginRight: '10px' }} />
                                </div>
                                <div>
                                    <div><strong>{track.title}</strong></div>
                                    <div>{track.artist.name}</div>
                                </div>
                            </div>
                        </ListItem>
                    </List>
                )
                )}
            </Container>
        </Grid>
    )
}

export default Queue;