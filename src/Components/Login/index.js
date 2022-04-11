import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import axios from 'axios'
import { userState } from '../../states';


const Login = ()=>{
    const [details, setDetails] = useState({email: '', password: '', remember: true})
    const [logging, setLogging] = useState(false);
    const [emailError, setEmailError] = useState({show:false, message: ''});
    const [passwordError, setPasswordError] = useState({show:false, message: ''});
    const [errorMessage, setErrorMessage] = useState({show: false, message: ''});

    const onChange = (e)=>{
        if(e.target.type === 'checkbox' )setDetails({...details, [e.target.name]: e.target.checked})
        else setDetails({...details, [e.target.name]: e.target.value})
    }

    const onSubmit = async ()=>{
        setEmailError({show:false})
        setPasswordError({show: false})
        setErrorMessage({show:false})
        setLogging(true)
        if(details.email === '' || details.email === null){
            setEmailError({show: true, message: 'Email cannot be empty'});
        }
        if(details.password === '' || details.password === null){
            setPasswordError({show: true, message: 'Password cannot be empty'});
        }
        if((details.email !== '' && details.email !== null) && (details.password !== '' && details.password !== null)){
            await axios.post(`/api/auth/login`, details, {
                headers: {
                  'Content-Type': 'application/json'
                }
            }).then(response=>{
                if(response.data.status === 200){
                    localStorage.setItem('z-user',JSON.stringify({
                        userId: response.data.userId,
                        email: response.data.email,
                     })
                    )

                    userState.update(s=>{})
                }else{
                    setErrorMessage({show: true.valueOf, message: response.data.error})
                    
                }
            })
        }
        setLogging(false)
        
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            {errorMessage.show && <Box sx={{marginBottom: '10px'}}>
                <Alert severity="warning" >{errorMessage.message}</Alert>
            </Box>}
            <TextField name='email' onChange={onChange} error={emailError.show} helperText={emailError.message} sx={{marginBottom: '10px'}} label='Email' disabled={logging}/>
            <TextField name='password' onChange={onChange} error={passwordError.show} helperText={passwordError.message} sx={{marginBottom: '10px'}} label='Password' type='password' disabled={logging}/>
            <FormGroup>
                <FormControlLabel control={<Checkbox name='remember' onChange={onChange} defaultChecked={details.remember} />} label="Remember me" />
            </FormGroup>
            <Button onClick={onSubmit} variant='contained' disableElevation>Login</Button>
        </Box>
    );
}

export default Login;