import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import {makeStyles} from '@mui/styles';

import {useHistory} from 'react-router-dom';

import {format} from 'date-fns';

import { supabase } from '../../Configs/supabase';
import {storeState, selectedStoreState, zheaderIdState, selectedDateState} from '../../states';

import {useDispatch, useSelector} from 'react-redux';


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
                <Box key={index}> 
                    <Paper sx={{padding: '10px'}} >
                        <Box sx={{display:'flex', flexDirection: 'row' ,justifyContent:'space-between'}}>
                            <Box sx={{display:'flex', flexDirection: 'row'}}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ paddingLeft: '20px' }}>
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
                                    <TableBody>
                                        <TableRow>
                                                <TableCell>{format(new Date(item?.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                                                <TableCell>{'$'}{(item?.target)?.toLocaleString('en-US')}</TableCell>
                                                <TableCell>{(item?.poids_target)?.toLocaleString('en-US')}</TableCell>
                                                <TableCell>{(item?.on_hand)?.toLocaleString('en-US')}</TableCell>
                                                <TableCell>{(item?.transaction_count)?.toLocaleString('en-US')}</TableCell>
                                                <TableCell>{(item?.people_count)?.toLocaleString('en-US')}</TableCell>
                                                <TableCell>{(item?.total_quantity)?.toLocaleString('en-US')}</TableCell>
                                        </TableRow>
                                    </TableBody>
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
    const [newModalOpen, setNewModalOpen] = useState(false);
    const [newHeaderDate, setNewHeaderDate] = useState(new Date());
    const store = useSelector(state=>state.store.selectedStore)
    const selectedStore = selectedStoreState.useState(s=>s);
    
    let history = useHistory();


    
    const handleClickOpen = () => {
        setNewModalOpen(true);
    };

    const handleClose = () => {
        setNewModalOpen(false);
    };


    const fetchData = ()=>{

        Promise.allSettled([
            (async ()=>{
                const {data: storeData,} = await supabase.from('stores').select('*').eq('id', store.store)
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

    const handleNewButton = ()=>{
        handleClickOpen()
    }

    const handleAddHeader = async ()=>{
        await supabase.from('z_header').insert({date: newHeaderDate.toISOString().split('T')[0], store_code: selectedStore}).then(({data, error})=>{
            if(data){
                zheaderIdState.update(s=>s=data[0]?.id);
                selectedDateState.update(s=>s=data[0]?.date)
                history.push('/ZReport')
            }
            if(error) console.log(error)
        })        
    }

    useEffect(fetchData,[selectedStore])

    return(
        <Box>
            {loading ?
            <Box className={classes.viewCenter}><CircularProgress/></Box>  :
            <Box>
                <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                    <Typography variant="h4" gutterBottom component="div">
                        Z-Headers ({selectedStore})
                    </Typography>
                    <Button variant='outlined' startIcon={<AddIcon />} onClick={handleNewButton}>
                        New
                    </Button>
                </Box>
                <Box>
                    {zHeaders.length ? <AccordionList list={zHeaders}/> : Array.from(Array(10)).map((_,index)=><Skeleton key={index} sx={{marginBottom: 1, borderRadius: 2}} variant='rectangular' height={50}/>)}
                </Box>
            </Box>
            }
            <div>
                <Dialog open={newModalOpen} onClose={handleClose} maxWidth='sm' fullWidth>
                    <DialogTitle>New Header Date</DialogTitle>
                    <DialogContent>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="Date"
                                inputFormat="MM/dd/yyyy"
                                // mask='____-__-__'
                                value={newHeaderDate}
                                onChange={(e)=>setNewHeaderDate(e)}
                                renderInput={(params) => <TextField variant='standard' {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleAddHeader}>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Box>
    ) 
    
}

export default HomeScreen;