import React, { useState, useEffect } from 'react';

import {supabase} from "../../Configs/supabase"

import Box from '@mui/material/Box';
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

const PayByPhoneDetails = (props)=>{

    const {selectedStore, sessions, zheader} = props;

    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [payByPhoneBanks, setPayByPhoneBanks] = useState([]);
    const [rows, setRows] = useState([]);
    let bankSummations = [];

    const onChange = async (e, row, session, bank)=>{
        // setSavedChanges(false);
        const targetValue = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
        if(row){
            toBeSavedState.update(s=>{s.payByPhoneDetails = [...s.payByPhoneDetails , {method: 'update', values: {value: targetValue}, id: row.id}]})
            // const {data, error} = await supabase.from('z_pbp_details').update({value: targetValue}).eq('id', row.id);
            // if(data) {
            //     setSavedChanges(true);
            // }
        }else if(!row){
            let newData = {
                zheader_id: zheader,
                pay_by_phone_id: bank.id,
                value: targetValue,
                session_id: session.session_id
            }
            toBeSavedState.update(s=>{s.payByPhoneDetails = [...s.payByPhoneDetails, {method: 'insert', values: newData}]})
            // const {data, error} = await supabase.from('z_pbp_details').insert(newData);
            // if(data) {
            //     setSavedChanges(true);
            // }
        }
    }

    const fetchData = async ()=>{
        Promise.allSettled([

            (async()=>{
                await supabase.from('pay_by_phone_banks').select('*').then(({data})=>{
                    if(data) setPayByPhoneBanks(data);
                });

                await supabase.from('z_pbp_details').select('*').then(({data})=>{
                    if(data) setRows(data);
                });

                const z_pbp_details = supabase.from('z_pbp_details').on('*', async payload=>{
                    await supabase.from('z_pbp_details').select('*').then(({data})=>{
                        if(data) setRows(data);
                    });    
                }).subscribe()
                
            })(),
        ]).finally(()=>{
            setLoading(false);
        })
    }

    useEffect(()=>{
        fetchData();
    }, [selectedStore])
    
    return (
        <Box sx={{padding: '10px 0'}}>
            <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <Typography variant="h6" gutterBottom component="div">
                    Pay-By-Phone Details
                </Typography>
            </Box>
            {loading? <Skeleton variant="rectangular" height={400} />
            :<Box>
                <TableContainer component={Paper}>
                    <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow className={classes.tableHeaders}>
                                <TableCell width={200}></TableCell>
                                {payByPhoneBanks?.map((bank,index)=>{
                                    bankSummations[index] = 0;
                                    return <TableCell>{bank.description}</TableCell>
                                })}
                                <TableCell><b>TOTAL</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sessions?.map((session)=>{
                                const sessionRows = rows.filter(row=>row.session_id === session.session_id)
                                let sessionSum = 0;
                                return <TableRow>
                                    <TableCell width={200}>{session.session_name}</TableCell>
                                    {payByPhoneBanks?.map((bank,index)=>{
                                        const row = sessionRows.find(row=>row.pay_by_phone_id === bank.id)
                                        bankSummations[index] += row?.value || 0
                                        sessionSum += row?.value || 0
                                        return <TableCell><CurrencyFormatter onChange={(e)=>onChange(e, row, session, bank)} value={row?.value || 0}/></TableCell>
                                    })}
                                    <TableCell className={classes.tableHeaders}><CurrencyFormatter value={sessionSum} disabled/></TableCell>
                                </TableRow>
                            })}

                            <TableRow>
                                <TableCell><b>Total</b></TableCell>
                                {payByPhoneBanks.map((bank,index)=>{
                                    return <TableCell className={classes.tableHeaders}><CurrencyFormatter value={bankSummations[index]} disabled/></TableCell>
                                })}
                                <TableCell className={classes.tableHeaders}><CurrencyFormatter value={bankSummations.reduce((partialSum, a) => partialSum + a, 0)} disabled/></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>}

        </Box>
    );
}

export default PayByPhoneDetails;