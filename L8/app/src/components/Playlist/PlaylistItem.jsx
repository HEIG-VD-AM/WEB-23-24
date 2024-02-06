import React, { useContext } from 'react';
import { ListItemButton } from '@mui/material';
import { MusicContext } from '../../contexts/MusicContext';

function PlaylistItem(props) {

    const {music, dispatch} = useContext(MusicContext);

    const handleClick = () => {
        console.log('enqueue track', props.track)
        dispatch({type: 'enqueue-track', track: props.track});
    }

    return (
        <ListItemButton divider onClick={() => {
           handleClick();
        }}>
        <div  style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={props.track.album.cover_small} alt={props.track.title} style={{ marginRight: '10px' }} />
            <div>
                <div><strong>{props.track.title}</strong></div>
                <div>{props.track.artist.name}</div>
            </div>
        </div>
        </ListItemButton>
    );
}

export default PlaylistItem;
