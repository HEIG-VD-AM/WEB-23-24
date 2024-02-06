import React, { useContext, useEffect, useState } from 'react';
import { MusicContext } from '../../contexts/MusicContext';
import { Stack } from '@mui/material';
import TinyText from '../Typography/TinyText';
import InfoText from '../Typography/InfoText';

const PlayerPlaylistCover = () => {
    const { music } = useContext(MusicContext);
    const { current } = music;

    const [currentTrack, setCurrentTrack] = useState();

    useEffect(() => {
        console.log("current", current);
        setCurrentTrack(current);
    }, [current]);

    if (!currentTrack) {
        return (<></>);
    }

    return (
        <Stack direction={'row'} sx={{paddingLeft:"0.5em"}}>
            <img src={currentTrack?.album.cover} width={56} height={56} alt={currentTrack?.title} />
            <Stack sx={{paddingLeft: "1em"}}>
                <InfoText>{currentTrack?.title}</InfoText>
                <InfoText>{currentTrack?.artist.name}</InfoText>
            </Stack>
        </Stack>
    )
};


export default PlayerPlaylistCover;
