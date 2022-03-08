import React, { useState, useReducer, useContext, useEffect } from 'react';


import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import Avatar from '@mui/material/Avatar';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import url from '../../shared/util/URL'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ChangePassword.css';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ChangePassword = () => {
  const history = useHistory();
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  );

  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });

  };
  

  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordMatchError, setPasswordMatchError] = useState(false)
  
  const formChange = (event)=>{
    const name = event.target.name
    const value = event.target.value
    setPasswords({
      ...passwords,
      [name]: value
    })    
  }

  const authSubmitHandler = async event => {
    event.preventDefault();
    // console.log(formInput)
   
    
    try {
      console.log(auth)
      const responseData = await sendRequest(
        url+ '/api/users/changePassword',
        'POST',
        JSON.stringify({...passwords, id:auth.userId}),
        {
          'Content-Type': 'application/json'
        }
      );
    //  console.log(responseData)
   //   auth.login(responseData.userId, responseData.token, responseData.position);
      history.push('/employee/' + responseData.userId);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(()=>{
    console.log(passwords)
    if(passwords.newPassword !== passwords.confirmPassword){
      return setPasswordMatchError(true)
    }else{
      return setPasswordMatchError(false)
    }
  }, [passwords])

  
  const classes = useStyles();
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <form className={classes.form} onSubmit={authSubmitHandler} onChange={formChange}>
            
            <TextField
              variant="outlined"
              margin="normal"
              onChange={handleInput}
              required
              fullWidth
              name="oldPassword"
              label="Old password"
              type="password"
              id="old-password"
              autoComplete="current-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              onChange={handleInput}
              required
              fullWidth
              name="newPassword"
              label="New password"
              type="password"
              id="new-password"
              autoComplete="current-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              onChange={handleInput}
              required
              fullWidth
              name="confirmPassword"
              label="Confirm password"
              type="password"
              id="confirm-password"
              autoComplete="current-password"
              error={passwordMatchError}
              helperText={passwordMatchError? "Passwords do not match": ""}
            />
            {passwords.newPassword === passwords.confirmPassword ?
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button> : <Button
              type="submit"
              fullWidth
              disabled
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
}
          </form>
        </div>

      </Container>
    </React.Fragment>
  );
};

export default ChangePassword;
