// MovieCard.js
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Rating, Box } from '@mui/material';
import { useTheme, useMediaQuery } from "@mui/material";

import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';

const id_to_genre = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
};


const MovieCard = ({ movie }) => {
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('sm'));
    
    // Inside your component's state
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
      <Card sx={{ width: isScreenSmall ? 300 : 500, marginTop: 2 }}>
          <CardMedia
            component="img"
            // height={isScreenSmall ? 70 : 100}
            sx={{ 
              height: isScreenSmall ? 320 : 350,
              width: '100%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <CardContent>
              <Typography gutterBottom variant="h5" component="div"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {movie.title}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Button aria-describedby={id} variant="contained" onClick={handleClick}
                sx={{
                  backgroundColor: '#3f51b5', // Change the color as per your preference
                  color: '#fff', // Change the text color as per your preference
                  '&:hover': {
                    backgroundColor: '#303f9f', // Change the hover color as per your preference
                  }}}>
                  Show Overview
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    {movie.overview}
                  </Typography>
                </Popover>

                <Rating name="read-only" value={movie.vote_average / 2} readOnly />
              </Box>

              <Typography variant="body2" color="text.secondary">
                {movie.genre_ids.map(id => id_to_genre[id]).join(', ')}
              </Typography>
          </CardContent>
      </Card>
    );
};

export default MovieCard;