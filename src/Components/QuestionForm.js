import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Box, Typography, Radio, RadioGroup } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

export default function QuestionForm({ id, title, options, onOptionToggle }) {
  const optionsPerColumn = 7;
  const firstColumnOptions = options.slice(0, optionsPerColumn);
  const secondColumnOptions = options.slice(optionsPerColumn);

  const theme = useTheme();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedOption, setSelectedOption] = useState(null);

  const handleRadioChange = (event) => { 
    options.forEach(option => onOptionToggle(id, option, false));
    
    setSelectedOption(event.target.value);
    onOptionToggle(id, event.target.value, true);
  };

  return (
    <Box sx={{ marginTop: isScreenSmall ? 0 : 3 }}>
      <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
          {id === 'highRating' || id === 'criticalAcclaim' ? (
            <RadioGroup value={selectedOption} onChange={handleRadioChange}>
              {firstColumnOptions.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          ) : (
            firstColumnOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                sx={{ width: '100%' }}
                control={
                  <Checkbox
                    onChange={(event) => onOptionToggle(id, option, event.target.checked)}
                  />
                }
                label={option}
              />
            ))
          )}
        </Box>
        {options.length > optionsPerColumn && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {secondColumnOptions.map((option, index) => (
              <FormControlLabel
                key={index + optionsPerColumn}
                sx={{ width: '100%' }}
                control={
                  <Checkbox
                    onChange={(event) => onOptionToggle(id, option, event.target.checked)}
                  />
                }
                label={option}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
