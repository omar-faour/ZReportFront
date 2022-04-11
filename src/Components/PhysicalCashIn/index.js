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
import TextField from '@mui/material/TextField';

import { makeStyles } from "@mui/styles";

import CurrencyFormatter from '../CurrencyFormatter';

import { toBeSavedState } from '../../states';


const useStyles=makeStyles({
    tableHeaders: {
      backgroundColor: 'rgba(0,0,0,0.04)',
    }
  })


const PhysicalCashOut = (props)=>{
    const {store, selectedStore, sessions, zheader} = props;
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [currencies, setCurrencies] = useState([]);
    const [rows, setRows] = useState([]);
    const [notes, setNotes] = useState([]);


    const onNoteChange = async (e, domination, id = null, cid)=>{
        if(!id){
            toBeSavedState.update(s=>{s.physicalCashInNotes = [...s.physicalCashInNotes, {method: 'insert', values:{domination: domination, note: e.target.value, zheader_id: zheader, cid: cid}}]})
            // await supabase.from('cash_in_notes').insert({domination: domination, note: e.target.value, zheader_id: zheader})
        }else if(id){
            toBeSavedState.update(s=>{s.physicalCashInNotes = [...s.physicalCashInNotes, {method: 'update', values:{note: e.target.value}, id: id}]})
            // await supabase.from('cash_in_notes').update({note: e.target.value}).eq('id', id);
        }
    }

    const onChange = async (e, row, domination, session, currency)=>{
        // setSavedChanges(false);
        const targetValue = parseInt(e.target.value.replace(/[^0-9.]/g, '')) || 0
        if(row){
            toBeSavedState.update(s=>{s.physicalCashIn = [...s.physicalCashIn , {method: 'update', values: {count: e.target.value}, id: row.id}]})
            // const {data, error} = await supabase.from('z_physical_cash_in').update({count: targetValue}).eq('id', row.id);
            // if(data) setSavedChanges(true)
        }else if(!row && targetValue && targetValue!==0){
            const z_date = new Date().toISOString().split('T')[0]
            let newData = {
                cid: currency.id,
                zheader_id: zheader,
                domination: domination,
                count: targetValue,
                store_code: selectedStore,
                session_id: session.session_id,
                rate: await (await supabase.from('exchanges').select('*').eq('currency', currency.id).lte('date', z_date).order('date', {ascending:false}).limit(1)).data[0].id,
                z_date: z_date
            }
            toBeSavedState.update(s=>{s.physicalCashIn = [...s.physicalCashIn, {method: 'insert', values: newData}]})
            // const {data, error} = await supabase.from('z_physical_cash_in').insert(newData);
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

            zheader && (async ()=>{
                await supabase.from('z_physical_cash_in').select('*').eq('zheader_id', zheader).then(({data})=>{
                    if(data) setRows(data);
                });
                supabase.from('z_physical_cash_in').on('*', async payload=>{
                    await supabase.from('z_physical_cash_in').select('*').eq('zheader_id', zheader).then(({data})=>{
                        if(data) setRows(data);
                    });
                }).subscribe()
            })(),

            
            zheader && (async ()=>{
                await supabase.from('cash_in_notes').select('*').eq('zheader_id', zheader).then(({data, error})=>{
                    if(data) {
                        setNotes(data)
                    }
                    if(error){
                        console.log("Notes: ", error)
                    }
                });
                supabase.from('cash_in_notes').on('*', async payload=>{
                    await supabase.from('cash_in_notes').select('*').eq('zheader_id', zheader).then(({data})=>{
                        if(data) {
                            console.log('notes: ', data)
                            setNotes(data)
                        }
                    });
                }).subscribe()
            })(),

        ]).finally(()=>{
            setLoading(false)
        })
    }


    useEffect(fetchData,[selectedStore])


    return(
    loading? <Skeleton variant="rectangular" height={400}/>:
        <Box>
            {currencies?.map(currency=>{
                const currencyRows = rows.filter(row=>row.cid === currency.id);
                let sessionSummations = [];
                return (
                    <Box sx={{padding: '10px 0'}} key={currency.code}>
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
                                                return <TableCell key={`session-name-${index}`}>{session.session_name}</TableCell>
                                            })}
                                            <TableCell>TOTAL</TableCell>
                                            <TableCell>Note</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currency.dominations.map((domination, index)=>{
                                            const dominationRows = currencyRows.filter(row=>row.domination === domination);
                                            const note = notes.find(row=>row.domination === domination && row.cid === currency.id);
                                            let dominationSum = 0;
                                            return <TableRow key={`domination-${index}`}>
                                                <TableCell width={200}>{domination}</TableCell>
                                                {sessions.map((session, index)=>{
                                                    const row = dominationRows.find(row=>row.session_id === session.session_id)
                                                    sessionSummations[index] += row?.count*domination || 0;
                                                    dominationSum += row?.count || 0;
                                                    return <TableCell key={`session-count-${index}`}>
                                                            <CurrencyFormatter onChange={(e)=>onChange(e, row, domination, session, currency)} row={row} value={row?.count || 0} isCurrency={false}/>
                                                    </TableCell>
                                                })}
                                                <TableCell className={classes.tableHeaders}><CurrencyFormatter value={dominationSum*domination} currency={currency.code} disabled/></TableCell>
                                                <TableCell><TextField onBlur={(e)=>onNoteChange(e, domination, note?.id || null, currency.id)} variant='standard' defaultValue={note?.note} InputProps={{disableUnderline: true}}/></TableCell>
                                            </TableRow>
                                        })}

                                        <TableRow>
                                            <TableCell>Total ({currency.code})</TableCell>
                                            {sessions.map((session, index)=>{
                                                return <TableCell className={classes.tableHeaders} key={`session-total-${index}`}><CurrencyFormatter value={sessionSummations[index]} currency={currency.code} disabled/></TableCell>
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

export default PhysicalCashOut;