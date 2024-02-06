import React from 'react';
import { Stack } from '@mui/material';
import InfoText from '../Typography/InfoText';

function PlaylistOverview(props) {

    return (
            <Stack direction="row" spacing={2}>
                <img src={props.img} alt={props.title} width={250} height={250} />
                <Stack>
                    <InfoText>PLAYLIST</InfoText>
                    <h1>{props.title}</h1>
                    <InfoText>{props.creator}</InfoText>
                    <InfoText>{props.created_at} &#183; {props.countSongs} songs &#183; {props.duration}</InfoText>
                </Stack>
            </Stack>
    );
}

export default PlaylistOverview;

