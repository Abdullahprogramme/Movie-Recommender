import React from "react";
import Header from "../Components/Header";
import { Stepper, Step, StepLabel, Button, Box, Card, ButtonGroup, Tooltip, IconButton, Alert } from '@mui/material';
import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import QuestionForm from "../Components/QuestionForm";
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

import InfoIcon from '@mui/icons-material/Info';


const useStyles = makeStyles({
  stepLabel: {
    fontSize: '17px',
    color: 'blue',
  },
});

export default function Recommendation() {
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [showAlert, setShowAlert] = useState(false);

    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();


    const classes = useStyles();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === 3) {
            if (Object.keys(selectedOptions).length < 4) {
                // Show a snackbar
                setShowAlert(true);
                setActiveStep((prevActiveStep) => prevActiveStep - 1);
                return;
            }
            handleFinish();
            navigate('/Recommender', { state: { selectedOptions, formSubmitted: true } });
            setSelectedOptions([])
        }
    };

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const handleTooltipClick = () => {
        setTooltipOpen(!tooltipOpen); // Toggle tooltip visibility on click
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // const handleReset = () => {
    //     setActiveStep(0);
    // };

    const handleOptionToggle = (id, option, isChecked) => {
      setSelectedOptions(prevOptions => {
        if (isChecked) {
          if (prevOptions[id]) {
            return { ...prevOptions, [id]: [...prevOptions[id], option] };
          } else {
            return { ...prevOptions, [id]: [option] };
          }
        } else {
          if (prevOptions[id]) {
            return { ...prevOptions, [id]: prevOptions[id].filter(o => o !== option) };
          } else {
            return prevOptions;
          }
        }
      });
    };

    const handleFinish = () => {
        console.log(selectedOptions);
    };

    function getSteps() {
        return ['Question 1', 'Question 2', 'Question 3', 'Question 4'];
    }
      
    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
              return <QuestionForm key={stepIndex} id="genre" title="What is your favourite movie genre?" options={['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Science Fiction']} onOptionToggle={handleOptionToggle} />;
            case 1:
              return <QuestionForm key={stepIndex} id="period" title="What period do you prefer your movies to be from?" options={['Before 1980', '1980-1990', '1990-2000', '2000-2010', '2010-2020', 'After 2020']} onOptionToggle={handleOptionToggle} />;
            case 2:
              return <QuestionForm key={stepIndex} id="highRating" title="Do you prefer movies with a high TMDB rating?" options={['Yes', 'No']} onOptionToggle={handleOptionToggle} />;
            case 3:
              return <QuestionForm key={stepIndex} id="criticalAcclaim" title="Do you prefer movies that are critically acclaimed (i.e., award-winning or nominated)?" options={['Yes', 'No']} onOptionToggle={handleOptionToggle} />;
            default:
              return 'Unknown stepIndex';
        }
    }

    return (
        <div>
          <Header />

          <Tooltip 
            title="Answer all the questions to get the recommendation else it will not be shown."
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

          {showAlert && 
            <Alert severity="error" onClose={() => setShowAlert(false)}
            sx={{ 
              position: 'absolute', 
              top: { xs: '10px', sm: '20px' }, 
              left: '50%', 
              transform: 'translateX(-50%)', 
              zIndex: 1000, 
              width: 'auto', 
              minWidth: '200px', 
              maxWidth: '90%',
            }}>
            Please answer all the questions to get the recommendation.
            </Alert>
          }


          <Card sx={{ 
            // backgroundColor: 'rgba(255, 255, 255, 0.63)', 
            backgroundColor: '#FFE180',
            borderRadius: '16px', 
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(11.5px)',
            WebkitBackdropFilter: 'blur(11.5px)',
            border: '1px solid #FFE180',
            padding: 2,
            margin: 2,
            // marginTop: 5,
            width: isScreenSmall ? '300px' : '600px',
            height: isScreenSmall ? '550px' : '580px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: isScreenSmall ? 0 : 5 }}>
            {isScreenSmall ? (
              <Stepper activeStep={activeStep} alternativeLabel>
                <Step>
                  <StepLabel>{steps[activeStep]}</StepLabel>
                </Step>
              </Stepper>
            ) : (
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel classes={{label: classes.stepLabel}}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* {activeStep === steps.length ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography>All steps completed</Typography>
                      <Button variant="outlined" color="primary" onClick={handleReset} sx={{justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>Reset</Button>
                  </Box>
              ) : ( */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {getStepContent(activeStep)}
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, position: 'absolute', bottom: 10 }}>
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button variant="contained" color="secondary" disabled={activeStep === 0} onClick={handleBack}>
                          Back
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleNext}>
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </ButtonGroup>
                  </Box>
                </Box>
              {/* )} */}
          </Box>
        </Card>
      </div>
    );
}





  
