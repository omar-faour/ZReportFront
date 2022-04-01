import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import {makeStyles} from '@mui/styles';

import {useHistory} from 'react-router-dom';

import {format} from 'date-fns';

import { supabase } from '../../Configs/supabase';
import {storeState, selectedStoreState, zheaderIdState, selectedDateState} from '../../states/index';


const useStyles = makeStyles({
    viewCenter: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
    }
   });

const AccordionList = ({list = []})=>{
  
    const [expanded, setExpanded] = useState(null);
    let history = useHistory();

    const handleExpand = (key)=>{
        setExpanded(expanded === key ? null : key)
    }

    const setHeader = (headerId, headerDate) => {
        zheaderIdState.update(s=>s=headerId);
        selectedDateState.update(s=>s=headerDate)
        history.push('/ZReport')
    }

    return (
        list.map((item, index)=>{
            return(
                <Box> 
                    <Paper sx={{padding: '10px'}} >
                        <Box sx={{display:'flex', flexDirection: 'row' ,justifyContent:'space-between'}}>
                            <Box sx={{display:'flex', flexDirection: 'row'}}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ paddingRight: '20px' }}>
                                    {item?.date}
                                </Typography>
                                <Button onClick={()=>setHeader(item?.id, item?.date)}>
                                    View
                                </Button>
                                {/* <Link to={`/ZReport/${item?.id}`} component={Button}>View</Link> */}
                            </Box>
                            <Box>
                                <IconButton onClick={()=>handleExpand(index)}>
                                    {expanded === index ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                </IconButton>
                            </Box>
                        </Box>
                        <Collapse in={expanded === index}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Created at</TableCell>
                                            <TableCell>Target</TableCell>
                                            <TableCell>Poids</TableCell>
                                            <TableCell>On hand</TableCell>
                                            <TableCell>Transactions</TableCell>
                                            <TableCell>People</TableCell>
                                            <TableCell>Total Qty.</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableRow>
                                            <TableCell>{format(new Date(item?.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                                            <TableCell>{'$'}{(item?.target).toLocaleString('en-US')}</TableCell>
                                            <TableCell>{(item?.poids_target).toLocaleString('en-US')}</TableCell>
                                            <TableCell>{(item?.on_hand).toLocaleString('en-US')}</TableCell>
                                            <TableCell>{(item?.transaction_count).toLocaleString('en-US')}</TableCell>
                                            <TableCell>{(item?.people_count).toLocaleString('en-US')}</TableCell>
                                            <TableCell>{(item?.total_quantity).toLocaleString('en-US')}</TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </Paper>
                    <Divider variant='middle'/>
                </Box>
            )
        })
    )
}


const HomeScreen = (props)=>{

    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [zHeaders, setZHeaders] = useState([]);
    const store = storeState.useState(s=>s);
    const selectedStore = selectedStoreState.useState(s=>s);

    const fetchData = ()=>{

        Promise.allSettled([
            (async ()=>{
                const {data: storeData, error: storeError} = await supabase.from('stores').select('*').eq('id', store.store)
                if(storeData){
                  selectedStoreState.update(s=>s=storeData[0].code_2)
                }
              })(),

            (async ()=>{
               selectedStore && await supabase.from('z_header').select('*').eq('store_code', selectedStore).order('date', {ascending: false}).then(({data})=>{
                    if(data) setZHeaders(data)
               })
            })()
        ]).finally(()=>{
            setLoading(false);
        })

    }

    useEffect(()=>{
        fetchData()
    },[selectedStore])

    return(
        <Box>
            {loading ?
            <Box className={classes.viewCenter}><CircularProgress/></Box>  :
            <Box>
                <Typography variant="h4" gutterBottom component="div">
                    Z-Headers ({selectedStore})
                </Typography>
                <Box>
                    {zHeaders.length ? <AccordionList list={zHeaders}/> : Array.from(Array(10)).map(_=><Skeleton sx={{marginBottom: 1, borderRadius: 2}} variant='rectangular' height={50}/>)}
                </Box>
            </Box>
            }
        </Box>
    ) 
    
}

export default HomeScreen;