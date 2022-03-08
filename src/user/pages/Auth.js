import React, { useState, useReducer, useContext, useEffect } from 'react';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Avatar from '@mui/material/Avatar';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import url from '../../shared/util/URL'
import Link from '@material-ui/core/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@mui/material/Container';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/lab/Autocomplete';
import {supabase} from "../../shared/util/supabase"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        MEC
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Auth = () => {
  const history = useHistory();
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      email: "",
      password: ""
    }
  );
  const [selected, setSelected] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      country: {},
      city: {},
      store:{}
    }
  );
  const [isCityDisabled, setIsCityDisabled] = useState(true)
  const [isStoreDisabled, setIsStoreDisabled] = useState(true)
  const [countries, setCountries] = React.useState([])
  const [cities, setCities] = React.useState([])
  const [stores, setStores] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  useEffect(async()=>{
    const { data, error } = await supabase
    .from('countries')
    .select('*')
      console.log(error)
      setCountries(data)
      
  },{})

  useEffect(async()=>{
    if(selected.country.description){
    const { data, error } = await supabase
    .from('cities')
    .select('*').eq('country', selected.country.id)
      console.log(error)
      console.log(data)
      setIsCityDisabled(false)
      setCities(data)
      console.log('KKKKKKKKKK')}
  },[selected.country.description])

  useEffect(async()=>{
    if(selected.country.description){
    const { data, error } = await supabase
    .from('stores')
    .select('*').eq('city', selected.city.id)
      console.log(error)
      console.log(data)
      setIsStoreDisabled(false)
      setStores(data)
      console.log('2w2wq2w')}
  },[selected.city.description])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleProceed = () => {
    setOpen(false);
    history.push('/zReport');
  };

  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  
  const handleSelected = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setSelected({ [name]: newValue });
  };

  const country = [
    { title: 'Congo', year: 1994 },
    { title: 'Brazavil', year: 1972 },
  ]

  const city = [
    { title: 'Kinshasa', year: 1994 },
    { title: 'Limite', year: 1974 },
    { title: 'Steps', year: 2008 },
  ]

  const store = [
    { title: 'LC', year: 1994 },
    { title: 'FLO', year: 1972 },
    { title: 'DS', year: 1972 },
  ]
   
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const authSubmitHandler = async event => {
    event.preventDefault();
    // console.log(formInput)
    let data = { formInput };
    try {
    /*  const responseData = await sendRequest(
        url+ '/api/users/login',
        'POST',
        JSON.stringify(data),
        {
          'Content-Type': 'application/json'
        }
      );*/
    
     // auth.login(responseData.userId, responseData.token, responseData.position, responseData.zone);
     auth.login("1", "123456789", "admin", "kinshasa"); 
     //history.push('/employee/' + responseData.userId);
    // history.push('/')
    console.log("OOPOPOPOPOPOPo")
    } catch (err) {
      console.log(err);
    }
    setOpen(true);
  };
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
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={authSubmitHandler} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              onChange={handleInput}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />  
            <TextField
              variant="outlined"
              margin="normal"
              onChange={handleInput}
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}>
              Sign In
            </Button>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>

      <Dialog open={open} >
        <DialogTitle>Choose</DialogTitle>
        <DialogContent>
       {/*   <DialogContentText>
            Select
  </DialogContentText>*/}
      <Autocomplete
      id="combo-box-demo"
      options={countries}
      onChange={(event, value) => setSelected({country:value}) }
      getOptionLabel={(option) => option.description}
      style={{ width: 300, margin:"8px" }}
      renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
    />
    <Autocomplete
      id="combo-box-demo1"
      options={cities}
      getOptionLabel={(option) => option.description}
      style={{ width: 300, margin:"8px" }}
      onChange={(event, value) => setSelected({city:value}) }
      disabled= {isCityDisabled}
      renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
    />
      <Autocomplete
      id="combo-box-demo2"
      options={stores}
      getOptionLabel={(option) => option.code_2}
      style={{ width: 300, margin:"8px" }}  
      disabled = {isStoreDisabled}
      renderInput={(params) => <TextField {...params} label="Store" variant="outlined" />}
    />
    
        </DialogContent>

        <DialogActions>
          <Button onClick={handleProceed}>Proceed</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default Auth;
