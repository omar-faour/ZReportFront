import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from '@mui/material/Alert';

import CheckStore from '../../Components/CheckStore';
import App from '../../App';
import {useSelector, useDispatch} from 'react-redux';
import {login} from '../../redux/actions/auth/authActions';
import useUser from '../../Utils/useUser';


const Container = (props)=>{
  const {user, isLoggedIn} = useUser();
  const store = useSelector(state=>state.store.store);
  if(isLoggedIn){
    return(
      store? <App/> : <CheckStore/>
    )
  }
  return props.children
}



const Auth = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [disabledButton, setDisabledButton] = useState(true);
  const dispatch = useDispatch();
  const signingIn = useSelector(state=>state.auth.signingIn);
  const credentialsError = useSelector(state=>state.auth.isError);
  const credentialsErrorMesage = useSelector(state=>state.auth.error);
  const state=useSelector(state=>state);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
      dispatch(login(credentials));
  };

  useEffect(() => {
    if (credentials.email.length > 0 && credentials.password.length > 0) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [credentials]);

  useEffect(()=>{
    console.log("STATE: ", state )
  })

  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        
        <Box sx={{ mt: 1 }}>
          {credentialsError && <Alert  severity="warning">{credentialsErrorMesage}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={disabledButton || signingIn}
            onClick={handleSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            {signingIn ? <> <CircularProgress sx={{marginRight: 1}} size={20}/> Signing in... </> : "Sign In"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Auth;