import React, { useState, useEffect } from 'react';
import {supabase} from "../../Configs/supabase"

import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import { makeStyles } from "@mui/styles";

import CurrencyFormatter from '../CurrencyFormatter';

import {toBeSavedState} from '../../states';


const useStyles=makeStyles({
    tableHeaders: {
      backgroundColor: 'rgba(0,0,0,0.04)',
    }
  })


const PhysicalCash = (props)=>{
    const {store, selectedStore, sessions, zheader} = props;
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [currencies, setCurrencies] = useState([]);
    const [rows, setRows] = useState([]);
    const toBeSaved = toBeSavedState.useState(s=>s.physicalCash);

    const onChange = async (e, row, domination, session, currency)=>{
        // setSavedChanges(false);
        if(row){
            toBeSavedState.update(s=>{s.physicalCash = [...s.physicalCash , {method: 'update', values: {count: e.target.value}, id: row.id}]})
            // const {data, error} = await supabase.from('z_physical_cash').update({count: e.target.value}).eq('id', row.id);
            // if(data) setSavedChanges(true)
        }else if(!row){
            const z_date = new Date().toISOString().split('T')[0]
            let newData = {
                cid: currency.id,
                zheader_id: zheader,
                domination: domination,
                count: e.target.value,
                store_code: selectedStore,
                session_id: session.session_id,
                rate: await (await supabase.from('exchanges').select('*').eq('currency', currency.id).lte('date', z_date).order('date', {ascending:false}).limit(1)).data[0].id,
                z_date: z_date
            }
            toBeSavedState.update(s=>{s.physicalCash = [...s.physicalCash, {method: 'insert', values: newData}]})

            // const {data, error} = await supabase.from('z_physical_cash').insert(newData);
            // if(data){
            //     setSavedChanges(true)
            // }
            // if(error){
            //     console.log("ERROR: ", error);
            // }
        }
    }

    const fetchData =async ()=>{
        Promise.allSettled([
            (async ()=>{
                const {data: currencyData, error: currencyError} = await supabase.from('currencies').select('*').in('id', (await supabase.from('countries').select('*').eq('id', store.country)).data[0].currencies);
                if(currencyData){
                    setCurrencies(currencyData);
                }
                if(currencyError){
                    console.log("Error: ", currencyError)
                }
            })(),

            (async ()=>{
                await supabase.from('z_physical_cash').select('*').eq('zheader_id', zheader).then(({data})=>{
                    if(data) setRows(data);
                });
                const z_physical_cash = supabase.from('z_physical_cash').on('*', async payload=>{
                    await supabase.from('z_physical_cash').select('*').eq('zheader_id', zheader).then(({data})=>{
                        if(data) setRows(data);
                    });
                }).subscribe()
            })(),


        ]).finally(()=>{
            setLoading(false)
        })
    }


    useEffect(()=>{
        fetchData()
    },[selectedStore])
   
    useEffect(()=>{
        console.log(toBeSaved)
    },[toBeSaved])


    return(
    loading? <Skeleton variant="rectangular" height={400} />:
        <Box>
            {currencies?.map(currency=>{
                const currencyRows = rows.filter(row=>row.cid === currency.id);
                let sessionSummations = [];
                return (
                    <Box sx={{padding: '10px 0'}}>
                        <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Typography variant="h6" gutterBottom component="div">
                                {`(${currency.code})`}
                            </Typography>
                        </Box>
                        <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <TableContainer component={Paper}>
                                <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow hover className={classes.tableHeaders}>
                                            <TableCell></TableCell>
                                            {sessions?.map((session, index)=>{
                                                sessionSummations[index] = 0;
                                                return <TableCell>{session.session_name}</TableCell>
                                            })}
                                            <TableCell>TOTAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currency.dominations.map(domination=>{
                                            const dominationRows = currencyRows.filter(row=>row.domination === domination);
                                            let dominationSum = 0;
                                            return <TableRow>
                                                        <TableCell width={200}>{domination}</TableCell>
                                                        {sessions.map((session, index)=>{
                                                            const row = dominationRows.find(row=>row.session_id === session.session_id)
                                                            sessionSummations[index] += row?.count*domination || 0;
                                                            dominationSum += row?.count || 0;
                                                            return <TableCell>
                                                                    <CurrencyFormatter onChange={(e)=>onChange(e, row, domination, session, currency)} row={row} value={row?.count || 0} isCurrency={false}/>
                                                            </TableCell>
                                                        })}
                                                        <TableCell className={classes.tableHeaders}><CurrencyFormatter value={dominationSum*domination} currency={currency.code} disabled/></TableCell>
                                                    </TableRow>
                                        })}

                                        <TableRow>
                                            <TableCell>Total ({currency.code})</TableCell>
                                            {sessions.map((session, index)=>{
                                                return <TableCell className={classes.tableHeaders}><CurrencyFormatter value={sessionSummations[index]} currency={currency.code} disabled/></TableCell>
                                            })}
                                            <TableCell className={classes.tableHeaders}><CurrencyFormatter value={sessionSummations.reduce((partialSum, a) => partialSum + a, 0)} currency={currency.code} disabled/></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )
}

export default PhysicalCash;