import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from "../Components/Header";
import { Button, ButtonGroup, Tooltip, IconButton, Snackbar, Alert, Skeleton } from "@mui/material";
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
    // const [movies, setMovies] = useState([]);
    // And the user's answers in the `answers` state
    const [answers, setAnswers] = useState({});
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


    const fetchAllMovies = useCallback(async () => {
        let allMovies = [];
        for (let i = 1; i <= 150; i++) {  
            const movies = await fetchMovies(i);
            allMovies = allMovies.concat(movies);
        }
        console.log('Fetched all movies:', allMovies.length);
        return allMovies;
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
        fetchAllMovies().then(allMovies => {
          if (isMounted.current) {
            const filteredMovies = filterMovies(allMovies, answers);
            setFiltered(filteredMovies);
            console.log(allMovies.length, filteredMovies.length);
          }
        });
      }, [answers, fetchAllMovies, filterMovies]);

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
        if (answers) {
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
            title="Fill the form in the Recommendation page and see the recommendations here else browse freely" 
            placement="bottom-start"
            className='myTooltip'
            open={tooltipOpen}
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
            <Skeleton variant="rectangular" width={isScreenSmall ? 300 : 360} height={isScreenSmall ? 490 : 540} sx={{ marginTop: 2 }} />
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
