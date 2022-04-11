import React from 'react';
import SummarizeIcon from '@mui/icons-material/Summarize';
import HomeIcon from '@mui/icons-material/Home';
import Add from '@mui/icons-material/Add';

export const routes = [
    {
        path: "/",
        text: "Home",
        icon: <HomeIcon/>
    },
    {
        path: "/ZReport",
        text: "Z Report",
        icon: <SummarizeIcon/>
    },
]