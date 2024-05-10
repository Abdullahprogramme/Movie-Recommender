import React, { useEffect, useState } from 'react';
import Header from "../Components/Header";
import { Button, ButtonGroup, Tooltip, IconButton } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { useLocation } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';


import axios from 'axios';
import MovieCard from '../Components/MovieCard';

export default function Recommender() {
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [movies, setMovies] = useState([]);
    // And the user's answers in the `answers` state
    const [answers, setAnswers] = useState({});

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleTooltipClick = () => {
        setTooltipOpen(!tooltipOpen); // Toggle tooltip visibility on click
    };

    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

    const handleNext = () => {
        if (currentMovieIndex < movies.length - 1) {
          setCurrentMovieIndex(currentMovieIndex + 1);
        }
    };
      
    const handleBack = () => {
        if (currentMovieIndex > 0) {
            setCurrentMovieIndex(currentMovieIndex - 1);
        }
    };

    const location = useLocation();
    useEffect(() => {
        setAnswers(location.state ? location.state.selectedOptions : null);
      }, [location]);

    console.log(answers)
    const fetchMovies = async (page) => {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            sort_by: 'popularity.desc',
            include_adult: true,
            include_video: true,
            page: page,
            },
        });

        return response.data.results;
    };

    const genreToId = (genreName) => {
        const genres = {
          'Action': 28,
          'Adventure': 12,
          'Animation': 16,
          'Comedy': 35,
          'Crime': 80,
          'Documentary': 99,
          'Drama': 18,
          'Family': 10751,
          'Fantasy': 14,
          'History': 36,
          'Horror': 27,
          'Music': 10402,
          'Mystery': 9648,
          'Romance': 10749,
          'Science Fiction': 878,
          'TV Movie': 10770,
          'Thriller': 53,
          'War': 10752,
          'Western': 37
        };
      
        return genres[genreName];
      };
    
    useEffect(() => {
        const fetchAllMovies = async () => {
            let allMovies = [];
            for (let i = 1; i <= 40; i++) {  // Fetch the first 5 pages of movies
              const movies = await fetchMovies(i);
              allMovies = allMovies.concat(movies);
            }
            setMovies(allMovies);
          };
        
          fetchAllMovies();
    }, []);


    // Filter the movies based on the user's answers when the answers change
    // useEffect(() => {
    //     const filteredMovies = movies.filter(movie => {
    //     // Filter by genre
    //     if (answers.genre && !movie.genre_ids.includes(genreToId(answers.genre))) {
    //         return false;
    //       }
    
    //     // Filter by period
    //     if (answers.period) {
    //         const year = parseInt(movie.release_date.substring(0, 4));
    //         if ((answers.period === 'Before 2000' && year >= 2000) ||
    //             (answers.period === '2000-2010' && (year < 2000 || year > 2010)) ||
    //             (answers.period === 'After 2010' && year <= 2010)) {
    //         return false;
    //         }
    //     }
    
    //     // Filter by TMDB rating
    //     if (answers.highRating === 'Yes' && movie.vote_average < 7) {
    //         return false;
    //     }
    
    //     // Filter by critical acclaim
    //     if (answers.criticalAcclaim === 'Yes' && movie.vote_count < 1000) {
    //         return false;
    //     }
    
    //     // If the movie passed all checks, include it in the filtered list
    //     return true;
    //     });
    
    //     setMovies(filteredMovies);
    // }, [answers]);

    return (
        <div className='Recommender flex flex-col justify-center items-center'>
            <Header />

            <Tooltip 
            title="Fill the form in the Recommendation page and see the recommendations here." 
            placement="bottom-start"
            open={tooltipOpen}
            >
            <IconButton 
                aria-label="info"
                onClick={handleTooltipClick}
                sx={{ 
                    position: 'absolute',
                    bottom: 2, // adjust this value to position the tooltip below the Header
                    left: 0,
                    color: 'whitesmoke',
                }}
            >
                <InfoIcon />
            </IconButton>
            </Tooltip>
            
            {/* Render the movies here */}
            {movies.length > 0 && <MovieCard movie={movies[currentMovieIndex]} sx={{ justifyContent: 'center', alignItems: 'center' }} />}
            
            {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, position: 'absolute', bottom: 10 }}></Box> */}
                <ButtonGroup variant="contained" aria-label="Basic button group" sx={{marginTop: 1}}>
                    <Button variant="contained" color='secondary' onClick={handleBack} disabled={currentMovieIndex === 0}>
                        Back
                    </Button>
                    <Button variant="contained" color='primary' onClick={handleNext}>
                        Next
                    </Button>
                </ButtonGroup>
            {/* </Box> */}

        </div>
    );
}
