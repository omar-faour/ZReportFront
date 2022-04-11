import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import axios from 'axios'


const Login = ()=>{
    const [details, setDetails] = useState({email: '', password: '', firstName: '', lastName: ''})
    const [logging, setLogging] = useState(false);
    const [emailError, setEmailError] = useState({show:false, message: ''});
    const [passwordError, setPasswordError] = useState({show:false, message: ''});
    const [errorMessage, setErrorMessage] = useState({show: false, message: ''});

    const onChange = (e)=>{
        if(e.target.type === 'checkbox' )setDetails({...details, [e.target.name]: e.target.checked})
        else setDetails({...details, [e.target.name]: e.target.value})
    }

    const onSubmit = async ()=>{
        setLogging(true)
        if(details.email === '' || details.email === null){
            setEmailError({show: true, message: 'Email cannot be empty'});
        }
        if(details.password === '' || details.password === null){
            setPasswordError({show: true, message: 'Password cannot be empty'});
        }
        if((details.email !== '' && details.email !== null) && (details.password !== '' && details.password !== null)){
            await axios.post(`/api/auth/register`, details, {
                headers: {
                  'Content-Type': 'application/json'
                }
            }).then(response=>{
                if(response.status === 200){
                    console.log('loggedIn')
                }else{
                    setErrorMessage({show: true.valueOf, message: response.data.error})
                    
                }
            })
        }
        setLogging(false)
        
    }

    useEffect(()=>{
        console.log(details)
    },[details])
    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            {errorMessage.show && <Box sx={{marginBottom: '5px'}}>
                <Alert severity="warning" >This is a warning alert — check it out!</Alert>
            </Box>}
    
            <TextField name='fname' onChange={onChange} sx={{marginBottom: '10px'}} label='First Name' disabled={logging}/>
            <TextField name='lname' onChange={onChange} sx={{marginBottom: '10px'}} label='Last Name' disabled={logging}/>
            <TextField name='email' onChange={onChange} error={emailError.show} helperText={emailError.message} sx={{marginBottom: '10px'}} label='Email' disabled={logging}/>
            <TextField name='password' onChange={onChange} error={passwordError.show} helperText={passwordError.message} sx={{marginBottom: '10px'}} label='Password' type='password' disabled={logging}/>
            
            <FormGroup>
                <FormControlLabel control={<Checkbox name='remember' onChange={onChange} defaultChecked={details.remember} />} label="Remember me" />
            </FormGroup>
            <Button onClick={onSubmit} variant='outlined'>Login</Button>
        </Box>
    );
}

export default Login;