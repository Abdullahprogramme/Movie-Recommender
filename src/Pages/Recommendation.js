import React from "react";
import Header from "../Components/Header";
import { Stepper, Step, StepLabel, Button, Typography, Box, Card, ButtonGroup } from '@mui/material';
import { useState } from 'react';
import { useMediaQuery, useTheme, Alert } from '@mui/material';
import QuestionForm from "../Components/QuestionForm";
import { makeStyles } from '@mui/styles';

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

    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('sm'));


    const classes = useStyles();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === 4) {
            handleFinish();
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleOptionToggle = (option, isChecked) => {
        if (isChecked) {
          setSelectedOptions((prevOptions) => [...prevOptions, option]);
        } else {
          setSelectedOptions((prevOptions) => prevOptions.filter((o) => o !== option));
        }
    };

    const handleFinish = () => {
        console.log(selectedOptions);
    };

    function getSteps() {
        return ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'];
    }
      
    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
              return <QuestionForm key={stepIndex} title="What is your favourite movie genre?" options={['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Fantasy']} onOptionToggle={handleOptionToggle} />;
            case 1:
              return <QuestionForm key={stepIndex} title="What decade do you prefer your movies to be from?" options={['1980s', '1990s', '2000s', '2010s']} onOptionToggle={handleOptionToggle} />;
            case 2:
              return <QuestionForm key={stepIndex} title="Do you prefer movies with a high IMDB rating?" options={['Yes', 'No']} onOptionToggle={handleOptionToggle} />;
            case 3:
              return <QuestionForm key={stepIndex} title="Do you prefer movies that are critically acclaimed?" options={['Yes', 'No']} onOptionToggle={handleOptionToggle} />;
            case 4:
              return <QuestionForm key={stepIndex} title="Do you prefer movies with a specific actor or director?" options={['Yes', 'No']} onOptionToggle={handleOptionToggle} />;
            default:
              return 'Unknown stepIndex';
        }
    }

    return (
        <div>
          <Header />
        
          <Alert 
            severity="info" 
            sx={{ 
              textAlign: 'center', 
              margin: 'auto', 
              width: isScreenSmall ? '300px' : '600px',
              marginTop: 3,
              justifyContent: 'center',
              alignItems: 'center' 
            }}
          >
            Fill out the following questions to get a movie recommendation!
          </Alert>

          <Card sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.63)', 
            borderRadius: '16px', 
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(11.5px)',
            WebkitBackdropFilter: 'blur(11.5px)',
            border: '1px solid rgba(255, 255, 255, 0.89)',
            padding: 2,
            margin: 2,
            // marginTop: 5,
            width: isScreenSmall ? '300px' : '600px',
            height: isScreenSmall ? '450px' : '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
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
              {activeStep === steps.length ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography>All steps completed</Typography>
                      <Button variant="outlined" color="primary" onClick={handleReset} sx={{justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>Reset</Button>
                  </Box>
              ) : (
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
              )}
          </Box>
          </Card>
        </div>
    );
}





  
