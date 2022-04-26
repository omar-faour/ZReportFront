import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles';

import {useHistory} from 'react-router-dom';



import {useSelector, useDispatch} from 'react-redux';
import {setStore, setSelectedStore} from '../../redux/reducers/store/storeSlice';
import useUser from '../../Utils/useUser';
import axios from 'axios';


const useStyles = makeStyles({
   selectBox:{
       margin: 10,
   },
   buttonBox: {
       margin: 10
   },
   buttonStyle:{
    backgroundColor: 'rgba(36,180,126)'
   },
   viewCenter: {
       position: 'absolute',
       top: '50%',
       left: '50%',
       transform: 'translate(-50%,-50%)'
   }
  });


const SelectStore = (props)=>{
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch()
    const {user, logout} = useUser()

    const [loading, setLoading] = useState(true);

    const [selectedLevels, setSelectedLevels] = useState({
        country: null,
        city: null,
        store: null
    });

    const [levels, setLevels] = useState({
        countries: [],
        cities: [],
        stores:[]
    });


    const onLevelChange = (e)=>{
        setSelectedLevels({...selectedLevels, [e.target.name]: e.target.value});
    }

    const onSubmit = ()=>{
        dispatch(setStore(selectedLevels));
        dispatch(setSelectedStore(levels.stores.find(store=>store.id === selectedLevels.store)));
        // history.push('/ZReport');

    }


    const checkUserLevels = async ()=>{
       

        if(user.access){
            const countries = await (await axios.get('/api/countries/list', {params:{array_list: user.access.countries}})).data
            const cities = await (await axios.get('/api/cities/list', {params:{array_list: user.access.cities}})).data
            const stores = await (await axios.get('/api/stores/list', {params:{array_list: user.access.stores}})).data
            setLevels({countries, cities, stores});
            if(countries.length === 1 && cities.length === 1 && stores.length === 1){
                //setSelectedLevels({country: countries[0], city: cities[0], store: stores[0]});
                dispatch(setStore({country: countries[0].id, city: cities[0].id, store: stores[0].id}))
                dispatch(setSelectedStore(stores[0]));
            }else{

                setSelectedLevels({country: countries[0].id, city: cities[0].id, store: stores[0].id});
            }

            setLoading(false);
        }
    }

    useEffect(checkUserLevels,[])
    
    return (
        <>
        <Box sx={{position: 'absolute', top: '10px', right: '10px'}}>
            <Button onClick={logout} variant='outlined'>Signout</Button>
        </Box>
        <Grid className={classes.viewCenter} container justifyContent='center'>
            {   loading ? 
            <Box>
                <CircularProgress />
            </Box> :
            <Grid item xs={12} md={6} lg={4}>
                <Box className={classes.selectBox}>
                { levels.countries.length > 0 &&
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Country</InputLabel>
                        <Select
                        name='country'
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Country"
                        defaultValue = {levels.countries[0].id}
                        onChange={onLevelChange}
                        >
                        {
                            levels.countries.map((country)=>(
                                <MenuItem value={country.id}>{country.description}</MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>
                } 
                </Box>
                <Box className={classes.selectBox}>
                { levels.cities.length > 0 &&
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">City</InputLabel>
                        <Select
                        name='city'
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Country"
                        defaultValue = {levels.cities[0].id}
                        onChange={onLevelChange}
                        >
                        {
                            levels.cities.map((city)=>(
                                <MenuItem value={city.id}>{city.description}</MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>
                } 
                </Box>
                <Box className={classes.selectBox}>
                { levels.stores.length > 0 &&
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Store</InputLabel>
                        <Select
                        name='store'
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Store"
                        defaultValue = {levels.stores[0].id}
                        onChange={onLevelChange}
                        >
                        {
                            levels.stores.map((store)=>(
                                <MenuItem value={store.id}>{store.code_2}</MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>
                } 
                </Box>
                <Box className={classes.buttonBox}>
                    <Button className={classes.buttonStyle} onClick={onSubmit} variant='contained' fullWidth disableElevation>
                        GO!
                    </Button>
                </Box>
            </Grid>
            }
        </Grid>
        </>
    );
}

export default SelectStore;