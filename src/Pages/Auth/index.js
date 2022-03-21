import React from 'react';
import { Auth, Typography, Button } from '@supabase/ui';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import App from '../../App';
import CheckStore from '../../Components/CheckStore'

import {storeState} from '../../states'


const theme = createTheme({
  palette:{
    primary:{
      main: 'rgba(36,180,126)',
      contrastText: '#fff'
    },
  }
});



const Container = (props) => {
  const { user } = Auth.useUser()
  const store = storeState.useState(s=>s);
  if (user)
    return (
      store ? 
      <App supabaseClient={props.supabaseClient} />:
      <CheckStore />
    )
  return props.children
}

export default function AuthBasic({supabaseClient}) {

  return (
    <ThemeProvider theme={theme}>
      <Auth.UserContextProvider supabaseClient={supabaseClient}>
        <Container supabaseClient={supabaseClient}>
          <Grid direction="row" container justifyContent="center" alignItems='center' height='100vh' padding={5}>
              <Grid item xs = {12} md = {4}>
                <Auth supabaseClient={supabaseClient} />
              </Grid>
          </Grid>
        </Container>
      </Auth.UserContextProvider>
    </ThemeProvider>
  )
}