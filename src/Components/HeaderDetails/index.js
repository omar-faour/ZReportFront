import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Skeleton from '@mui/material/Skeleton';

import { supabase } from '../../Configs/supabase';
import CurrencyFormatter from '../CurrencyFormatter';

import {toBeSavedState} from '../../states';

const DatePicker = ({value, onChange})=>{
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                label="Date desktop"
                inputFormat="yyyy-MM-dd"
                mask='____-__-__'
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField variant='standard' {...params}  />}
                
            />
        </LocalizationProvider>
    )
}


const HeaderDetails = (props)=>{

    const {selectedStore, zheader} = props;
    const [loading, setLoading] = useState(true);
    const [headerData, setHeaderData] = useState([]);

    const fetchData = ()=>{
        Promise.allSettled([
            (async ()=>{
                await supabase.from('z_header').select('*').eq('id', zheader).then(({data})=>{
                    if(data){
                        setHeaderData(data[0]);
                    }
                })

                supabase.from('z_header').on('*', async payload=>{
                    await supabase.from('z_header').select('*').eq('id', zheader).then(({data, error})=>{
                        if(data){
                            setHeaderData(data[0]);
                        }
                        if(error){
                            console.log('PAYLOAD ERROR: ', error)
                        }
                    })
                }).subscribe()
            })(),
        ]).finally(()=>{
            setLoading(false);
        })
    }

    const onChange = async (e, key)=>{
        let targetValue = 0;
        if(key === 'date'){
            targetValue = new Date(e).toISOString().split('T')[0]
        }else{
            targetValue = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
        }
        console.log(`${key}: ${targetValue}`)
        toBeSavedState.update(s=>{s.headerDetails = {...s.headerDetails, [key]: targetValue, id: zheader}})
        // await supabase.from('z_header').update({[key]: targetValue}).eq('id', zheader).then(({data, error})=>{
        //     if(error){
        //         console.log('error: ', error)
        //     }
        // });
    }

    useEffect(()=>{
        fetchData();
    }, [selectedStore]);


    return (
    <>
        {loading? <Skeleton variant="rectangular" height={200}/>:
        <Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Target</TableCell>
                            <TableCell>onHand</TableCell>
                            <TableCell>Poids Target</TableCell>
                            <TableCell>Transactions</TableCell>
                            <TableCell>People Count</TableCell>
                            <TableCell>Total Qty.</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><DatePicker onChange={(e)=>onChange(e, 'date')} value={headerData?.date}/></TableCell>
                            <TableCell><CurrencyFormatter onChange={(e)=>onChange(e, 'target')} value={headerData?.target}/></TableCell>
                            <TableCell><CurrencyFormatter onChange={(e)=>onChange(e, 'on_hand')} isCurrency={false} value={headerData?.on_hand} /></TableCell>
                            <TableCell><CurrencyFormatter onChange={(e)=>onChange(e, 'poids_target')} isCurrency={false} value={headerData?.poids_target}/></TableCell>
                            <TableCell><CurrencyFormatter onChange={(e)=>onChange(e, 'transaction_count')} isCurrency={false} value={headerData?.transaction_count}/></TableCell>
                            <TableCell><CurrencyFormatter onChange={(e)=>onChange(e, 'people_count')} isCurrency={false} value={headerData?.people_count}/></TableCell>
                            <TableCell><CurrencyFormatter onChange={(e)=>onChange(e, 'total_quantity')} isCurrency={false} value={headerData?.total_quantity}/></TableCell>
                        </TableRow>
                    </TableHead>
                    
                </Table>
            </TableContainer>
        </Box>
        }
    </>
    );
}

export default HeaderDetails;