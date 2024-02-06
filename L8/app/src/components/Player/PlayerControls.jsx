import React, { useContext, useEffect, useRef, useState } from 'react';
import { MusicContext } from '../../contexts/MusicContext'; // Importer votre MusicContext
import '../../resources/Player.css'; // Importer le fichier CSS pour le style
import { IconButton, Slider, Stack } from '@mui/material';
import TinyText from '../Typography/TinyText';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPrevious from '@mui/icons-material/SkipPrevious';
import SkipNext from '@mui/icons-material/SkipNext';
import PauseIcon from '@mui/icons-material/Pause';

const formatDuration = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const PlayerControls = () => {
    const { music, dispatch } = useContext(MusicContext);
    const { current, status, queue } = music;
    const [progress, setProgress] = useState(0); // État fictif pour la progression
    const [time, setTime] = useState(0); // État fictif pour la durée

    // Logique du player

    const handlePrevious = () => {
        dispatch({ type: 'previous-track' });
        setProgress(0);
    };

    const handlePlayPause = () => {
        if (status === 'playing') {
            dispatch({ type: 'pause-track' });
        } else {
            dispatch({ type: 'play-track' });
        }
    };

    const handleNext = () => {
        dispatch({ type: 'next-track' });
        setProgress(0);
        setTime(0);
    };


    const handleProgressChange = (event, newValue) => {
        setProgress(newValue);
        audioElement.current.currentTime = newValue / 100 * audioElement.current.duration;
    }

    const audioElement = useRef(null);

    useEffect(() => {
        if (music.status === "playing") {
            if (audioElement.current.src !== current.preview) {
                audioElement.current.src = current.preview;
            }
            audioElement.current.play();
        } else {
            audioElement.current.pause();
        }
    }, [music.status, current])

    useEffect(() => {
        const audio = audioElement.current;
        audio.volume = 0.01;

        const handleEnded = () => {
            handleNext();
        };
    
        const handleTimeUpdate = () => {
            setTime(audio.currentTime);
            setProgress(audio.currentTime / audio.duration * 100);
        };
    
        audio?.addEventListener('ended', handleEnded);
        audio?.addEventListener('timeupdate', handleTimeUpdate);
    
        // Cleanup function to remove the event listeners when the component unmounts
        return () => {
            audio?.removeEventListener('ended', handleEnded);
            audio?.removeEventListener('timeupdate', handleTimeUpdate);
        };
    })

    return (

        <Stack 
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <IconButton aria-label="play/pause" onClick={handlePrevious}>
                <SkipPrevious />
            </IconButton>
            <IconButton aria-label="play/pause" onClick={handlePlayPause}>
                {status === 'paused' ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
            <IconButton aria-label="play/pause" onClick={handleNext}>
                <SkipNext />
            </IconButton>
            {/* https://mui.com/material-ui/react-slider/ */}
            <TinyText sx={{ paddingX: 1 }}>{formatDuration(time)}</TinyText>
            <Slider
                aria-label="time-indicator"
                size="small"
                value={progress}
                min={0}
                step={1}
                max={100}
                onChange={handleProgressChange}
                sx={{
                    marginX: 2,
                    color: 'rgba(0,0,0,0.87)',
                    height: 4,
                    '& .MuiSlider-thumb': {
                    width: 8,
                    height: 8,
                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                    '&:before': {
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                    },
                    '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
                    },
                    '&.Mui-active': {
                        width: 20,
                        height: 20,
                    },
                    },
                    '& .MuiSlider-rail': {
                    opacity: 0.28,
                    },
                }}
            />
            {/* cas réel : music.current?.duration ?? 0 */}
            <TinyText
                sx={{ paddingX: 1 }}
            >{formatDuration(music.current?.duration ? 30 : 0)}</TinyText>
            <audio ref={audioElement} />
        </Stack>
    );
};

export default PlayerControls;
