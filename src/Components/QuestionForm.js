import React from 'react';
import { Checkbox, FormControlLabel, Box, Typography } from '@mui/material';

export default function QuestionForm({ title, options, onOptionToggle }) {
  const optionsPerColumn = 4;
  const firstColumnOptions = options.slice(0, optionsPerColumn);
  const secondColumnOptions = options.slice(optionsPerColumn);

  return (
    <Box>
      <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {firstColumnOptions.map((option, index) => (
            <FormControlLabel
              key={index}
              sx={{ width: '100%' }}
              control={
                <Checkbox
                  onChange={(event) => onOptionToggle(option, event.target.checked)}
                />
              }
              label={option}
            />
          ))}
        </Box>
        {options.length > optionsPerColumn && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {secondColumnOptions.map((option, index) => (
              <FormControlLabel
                key={index + optionsPerColumn}
                sx={{ width: '100%' }}
                control={
                  <Checkbox
                    onChange={(event) => onOptionToggle(option, event.target.checked)}
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