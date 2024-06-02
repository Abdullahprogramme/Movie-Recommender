import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from "../Components/Header";
import { Button, ButtonGroup, Typography, Tooltip, IconButton, Snackbar, Alert, Skeleton, Card, CardContent } from "@mui/material";
import { useLocation } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useTheme, useMediaQuery } from "@mui/material";

import axios from 'axios';
import MovieCard from '../Components/MovieCard';
import Filter from '../Components/Filter';


export default function Recommender() {
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const isMounted = useRef(true);

    // And the user's answers in the `answers` state
    const [answers, setAnswers] = useState({});
    const [allMovies, setAllMovies] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleTooltipClick = () => {
        setTooltipOpen(!tooltipOpen); // Toggle tooltip visibility on click
    };

    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

    const handleNext = () => {
        if (currentMovieIndex < filtered.length - 1) {
          setCurrentMovieIndex(currentMovieIndex + 1);
        }
    };
      
    const handleBack = () => {
        if (currentMovieIndex > 0) {
            setCurrentMovieIndex(currentMovieIndex - 1);
        }
    };

    const auth = getAuth();
    
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [userName, setUserName] = useState('');


    // Helper function to split an array into chunks
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    // Helper function to process an array of promises sequentially
    const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    };

    const fetchAllMovies = useCallback(async () => {
        let allMovies = [];
        const pages = Array.from({length: 250}, (_, i) => i + 1); // Create an array of page numbers
        const pageChunks = chunkArray(pages, 10); // Split the pages into chunks of 10

        const fetchPage = async (page) => {
            const movies = await fetchMovies(page);
            const moviesWithCast = await Promise.all(movies.map(movie => fetchMovieCast(movie.id).then(cast => ({ ...movie, cast }))));
            return moviesWithCast;
        };

        await asyncForEach(pageChunks, async (chunk) => {
            const allMoviesPages = await Promise.all(chunk.map(fetchPage));
            allMovies = allMovies.concat(allMoviesPages.flat()); // Flatten the array of arrays into a single array and add it to allMovies
        });

        console.log('Fetched all movies:', allMovies.length);
        setAllMovies(allMovies); // Set the allMovies state
    }, []);
    
    const filterMovies = useCallback((allMovies, answers) => {
        console.log('Before filtering:', allMovies.length);
        const filteredMovies = Filter(allMovies, answers, genreToId);
        console.log('After filtering:', filteredMovies.length);
        return filteredMovies;
    }, []);
    
    useEffect(() => {
        return () => {
          isMounted.current = false;
        };
      }, []);
      
    const get = useCallback(() => {
        if (isMounted.current) {
            const filteredMovies = filterMovies(allMovies, answers);
            setFiltered(filteredMovies);
            console.log(allMovies.length, filteredMovies.length);
        }
    }, [answers, allMovies, filterMovies]);

    useEffect(() => {
        fetchAllMovies();
    }, [fetchAllMovies]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && !localStorage.getItem('welcomeShown')) {
                setUserName(user.displayName);
                setOpenSnackbar(true);
                localStorage.setItem('welcomeShown', 'true');
            }
        });
    
        // Cleanup function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, [auth, get]);
    
    const location = useLocation();
    const defaultState = { formSubmitted: false, selectedOptions: null };
    const state = location.state || defaultState;

    useEffect(() => {
        if (state.formSubmitted === true && state.selectedOptions !== null) {
            setAnswers(state.selectedOptions);
        }
    }, [state.formSubmitted, state.selectedOptions]);

    useEffect(() => {
        if (Object.keys(answers).length > 0) { // Only call get() when answers is not empty
            get();
        }
    }, [get, answers]);
    

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

    const fetchMovieCast = async (movieId) => {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
            },
        });
    
        return response.data.cast.slice(0, 5);
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


    return (
        <div className='Recommender flex flex-col justify-center items-center'>
            <Header />
            
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000} 
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Welcome {userName}
                </Alert>
            </Snackbar>

            <Tooltip 
            title="Please complete the form on the Recommendation page to view personalized movie recommendations here!"
            placement="bottom-start"
            className='myTooltip'
            open={tooltipOpen}
            onMouseLeave={() => setTooltipOpen(false)}
            onMouseEnter={() => setTooltipOpen(true)}
            >
                <IconButton 
                    aria-label="info"
                    onClick={handleTooltipClick}
                >
                    <InfoIcon />
                </IconButton>
            </Tooltip>
            
            {/* Render the movies here */}
            {filtered.length > 0 ? (
            <MovieCard movie={filtered[currentMovieIndex]} sx={{ justifyContent: 'center', alignItems: 'center' }} />
            ) : (
                <Card sx={{ width: isScreenSmall ? 300 : 360, marginTop: 2, height: isScreenSmall ? 490 : 540, backgroundColor: '#EADBC8'}}>
                    <Skeleton variant="rectangular" width="100%" height={isScreenSmall ? 320 : 350} />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" component="p"> Waiting for recommendations...</Typography>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                    </CardContent>
                </Card>
            )}

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
