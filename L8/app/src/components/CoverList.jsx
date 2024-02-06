import React from 'react';
import useSWR from 'swr';

import { ImageListItem, ImageList, ImageListItemBar, Box } from '@mui/material'
import { Link } from 'react-router-dom';

const fetcher = (url) => fetch(url).then((res) => res.json());

function CoverList() {

    const { data, error } = useSWR('http://localhost:8080/popular/playlists', fetcher);
    if (error) return <div>Couldn't load playlists.</div>
    if (!data) return <div>Loading...</div>


    return (
        <Box sx={{ paddingBottom: "5em", bgcolor: 'background.paper' }}>
            <ImageList className="cover-list" cols={4} rowHeight={300} gap={20} >
                {data.map((playlist) => (
                    <Link to={`/playlist/${playlist.id}`}>
                    <ImageListItem key={playlist.id} sx={{maxWidth: 300}}>
                        <img
                            src={playlist.picture_xl}
                            alt={playlist.title}
                        />
                        <ImageListItemBar
                            title={playlist.title}
                            subtitle={playlist.user.name}
                        />
                    </ImageListItem>
                    </Link>
                ))}
            </ImageList>
        </Box>
    );
}

export default CoverList;
