import React from "react";
import Header from "../Components/Header";
import { Alert } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

export default function Recommender() {
    const theme = useTheme();
    const isScreenSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div>
            <Header />

            <Alert 
                severity="info" 
                sx={{ 
                    textAlign: 'center', 
                    margin: 'auto', 
                    width: isScreenSmall ? '310px' : '600px',
                    marginTop: 3,
                    justifyContent: 'center',
                    alignItems: 'center' 
                }}
            >
            FIll the form in the Recommendation page and see the recommendations here.
            </Alert>
           
        </div>
    );
}
