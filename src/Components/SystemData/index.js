import React, {useEffect, useState} from "react";
import {supabase} from "../../Configs/supabase"
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';

import {storeState} from '../../states';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from "@mui/styles";
import SaveIcon from '@mui/icons-material/Save';

import CurrencyFormatter from '../CurrencyFormatter'





// register Handsontable's modules
registerAllModules();

  
  const useStyles=makeStyles({
    tableHeaders: {
      backgroundColor: 'rgba(0,0,0,0.04)',
    }
  })


  const SystemData = () => {

    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [rowHeaders, setRowHeaders] = useState([]); 
    const [totalRowHeaders, setTotalRowHeaders] = useState([]); 
    const [rows, setRows] = useState([]); 
    const [headers, setHeaders] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const store = storeState.useState(s=>s);

    let values = {fields: [], totals: []};


    const onChange = async (e, row, rowHeader, session)=>{
      const targetValue = parseInt(e.target.value.replace(/[^\d.-]/g, '')) || 0;

      if(row){ 
        const updatedDetails = {}
        let amount_1;
        let amount_2;

        if(rowHeader.currency.id === 1){
            const {data: rate_value, error} = await supabase.from('exchanges').select('*').eq('currency', 2).lte('date', row.z_date).order('date', {ascending:false}).limit(1);
            updatedDetails['amount_f'] = parseInt(targetValue)
            updatedDetails['amount_1'] = parseInt(targetValue)
            updatedDetails['amount_2'] = parseInt(targetValue) * parseInt(rate_value[0].rate);
        }else if(rowHeader.currency.id === 2){
            const {data: rate_value, error} = await supabase.from('exchanges').select('*').eq('currency', 2).lte('date', row.z_date).order('date', {ascending:false}).limit(1);
            updatedDetails['amount_f'] = parseInt(targetValue)
            updatedDetails['amount_2'] = parseInt(targetValue)
            updatedDetails['amount_1'] = parseInt(targetValue)/parseInt(rate_value[0].rate);
        }else if(rowHeader.currency.id !== 1 && rowHeader.currency.id !== 1){
            const {data: rate_1_value, error} = await supabase.from('exchanges').select('*').eq('currency', rowHeader.currency.id).lte('date', row.z_date).order('date', {ascending:false}).limit(1);;
            amount_1 = parseInt(targetValue)*rate_1_value;
            const {data: rate_2_value, error: rate_2_Error} = await supabase.from('exchanges').select('*').eq('currency', 2).lte('date', row.z_date).order('date', {ascending:false}).limit(1);
            if(rate_2_value){
                const rate_2_value = rate_2_value[0].rate;
                amount_2 = amount_1 * rate_2_value;

                updatedDetails['amount_f'] = parseInt(targetValue)
                updatedDetails['amount_1'] = amount_1
                updatedDetails['amount_2'] = amount_2;
            }
        }
        
          const{data, error} = await supabase.from('z_details').update(updatedDetails).eq('id', row.id);

          if(data){
          setRows(oldRows=>{
              const filteredRows = oldRows.filter(oldRow=>oldRow.id !== row.id)
              return [...filteredRows, {...row, ...updatedDetails}]
          })
          }
          if(error){
            console.log("Error: ", error);
          }

      }else if(!row && !targetValue){
        console.log(targetValue)
        console.log("Not Row: ", rowHeader)
        console.log('session' , session)
        let z_date = new Date().toISOString().split('T')[0]
        let newData = {
          z_date: z_date,
          session_id: session.session_id,
          store_code: selectedStore,
          ptid: rowHeader.payment.id,
          cid: rowHeader.currency.id,
          zheader_id : 1
        }
        if(rowHeader.currency.id === 1){
          const {data: rate_1_value} = await supabase.from('exchanges').select('*').eq('currency', 1).lte('date', z_date).order('date', {ascending:false}).limit(1);
          const {data: rate_2_value} = await supabase.from('exchanges').select('*').eq('currency', 2).lte('date', z_date).order('date', {ascending:false}).limit(1);
          newData['rate'] = parseInt(rate_1_value[0].id)
          newData['amount_f'] = parseInt(targetValue);
          newData['amount_1'] = parseInt(targetValue);
          newData['amount_2'] = parseInt(targetValue)*parseInt(rate_2_value[0].rate);
        }else if(rowHeader.currency.id === 2){
          const {data: rate_1_value} = await supabase.from('exchanges').select('*').eq('currency', 1).lte('date', z_date).order('date', {ascending:false}).limit(1);
          const {data: rate_2_value} = await supabase.from('exchanges').select('*').eq('currency', 2).lte('date', z_date).order('date', {ascending:false}).limit(1);
          newData['rate'] = parseInt(rate_1_value[0].id);
          newData['amount_f'] = parseInt(targetValue);
          newData['amount_2'] = parseInt(targetValue);
          newData['amount_1'] = parseInt(targetValue)/parseInt(rate_2_value[0].rate);
        }else if(rowHeader.currency.id !== 1 && rowHeader.currency.id !== 2){
          const {data: rate_1_value} = await supabase.from('exchanges').select('*').eq('currency', rowHeader.currency.id).lte('date', z_date).order('date', {ascending:false}).limit(1);
          const {data: rate_2_value} = await supabase.from('exchanges').select('*').eq('currency', 2).lte('date', z_date).order('date', {ascending:false}).limit(1);
          newData['rate'] = parseInt(rate_1_value[0].id)
          newData['amount_f'] = parseInt(targetValue);
          newData['amount_1'] = parseInt(targetValue)*parseInt(rate_1_value[0].rate);
          newData['amount_2'] = parseInt(targetValue)*parseInt(rate_1_value[0].rate)*parseInt(rate_2_value[0].rate);
        }

        const {data, error} = await supabase.from('z_details').insert(newData)
        if(data) console.log('INSERT: ', data)
        if(error) console.log('insert error: ', error)
      }
      
      


  }

  const fetchData = async ()=>{
        Promise.allSettled([

          (async ()=>{
            const {data: storeData, error: storeError} = await supabase.from('stores').select('*').eq('id', store.store)
            if(storeData){
              setSelectedStore(storeData[0].code_2)
            }
            if(storeError){
              console.log("STORE ERROR: ", storeError)
            }          
        })(),

        (async ()=>{

          const {data: sessionsData, error: sessionsError} = await supabase.from('sessions').select('session_id: id, session_name: name').eq('store_code', selectedStore)
            if(sessionsData){
              let array = [];
              sessionsData.map(session=>array.push(session));
              setSessions([...array]);
            }

            if(sessionsError){
              console.log("Sessions Error: ", sessionsError)
            }

          const {data: paymentsData, error: paymentsError} = await supabase.from('payment_types').select('*, type_of(*)').not('type_of', 'is', null)
            if(paymentsData){
              const {data: currencyData, error: currencyError} = await supabase.from('currencies').select('*').in('id', (await supabase.from('countries').select('*').eq('id', store.country)).data[0].currencies)
              if(currencyData){
                setCurrencies(currencyData)
                let array = [];
                paymentsData.map(payment=>{
                  return currencyData.map(currency=>{
                    return array.push({payment: {...payment}, currency: {...currency}})
                  })
                })
                setRowHeaders([...array])
              }
            }

          const {data: paymentTypesData, error: paymentTypesError} = await supabase.from('payment_types').select('*, type_of(*)').is('type_of', null)
              if(paymentTypesData){
                let array =[];
                paymentTypesData.map(payment=>{
                  return array.push({payment: {...payment}})
                })
                setTotalRowHeaders([...array])
              }
              
              if(paymentTypesError){
                console.log("paymentDataError: ", paymentTypesError)
              }

          const {data, error} = await supabase.from('z_details').select('*, ptid(*), zheader: zheader_id(*), rate: rate(*)').eq('zheader_id', 1);

            if(data){
              setRows(data);
              setSelectedDate(data[0].zheader.created_at.split("T")[0]);
            }
        })(),

      ]).finally(()=>{
        setLoading(false)
      })
    }

   
    useEffect(()=>{
      fetchData()
    },[selectedStore])

  useEffect(()=>{
    console.log("Rows", rows)
  },[rows])




    return (
      <Box>
        {
          loading ? 
          <Box sx={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <CircularProgress />
          </Box>:
          <>
          <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Typography variant="h4" gutterBottom component="div">
              {selectedStore} | {selectedDate}
            </Typography>
            
          </Box>
          <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <TableContainer component={Paper}>
                <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow hover className={classes.tableHeaders}>
                      <TableCell></TableCell>
                      {sessions.map(session=>(<TableCell>{session.session_name}</TableCell>))}
                      <TableCell>TOTAL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowHeaders.map((rowHeader, index)=>{
                      let rowValues = [];
                      return (
                      <TableRow hover>
                        <TableCell>
                          {rowHeader?.payment?.type} ({rowHeader?.currency?.code})
                        </TableCell>
                        
                          {sessions.map(session=>{
                            
                            const row = rows.find(row=>row.ptid.id === rowHeader.payment.id && row.cid === rowHeader.currency.id && row.session_id === session.session_id)
                            rowValues.push(row?.amount_f ??  0)
                              return (
                                <TableCell>
                                  <CurrencyFormatter onChange={(e)=>onChange(e, row, rowHeader, session)} setRows={setRows} row={row} value={row?.amount_f ?? 0} currency={rowHeader?.currency?.code ?? 'USD'}/>
                                </TableCell>
                              )
                          })}
                          <TableCell className={classes.tableHeaders}>
                            <b>
                              <CurrencyFormatter value={rowValues.reduce((partialSum, a) => partialSum + a, 0)} currency={rowHeader?.currency?.code ?? 'USD'} disabled/>
                            </b>
                          </TableCell>

                          {(()=>{
                            values.fields.push(rowValues)
                          })()}

                      </TableRow>
                      )
                    })}

                    {totalRowHeaders.map(totalRow=>{
                      let rowValues =[];
                     return (
                       <TableRow hover>
                         <TableCell>
                           <b>{totalRow.payment.type} (Total)</b>
                         </TableCell>
                        {
                          sessions.map((session, index)=>{
                            const filteredRows = rows.filter(row => row.session_id === session.session_id && row.ptid.type_of === totalRow.payment.id );
                            let sum =0;
                            filteredRows.map(row=>{
                              return sum+=row.amount_1
                            })
                            rowValues.push(sum);
                            return(
                              <TableCell className={classes.tableHeaders}>
                                <b>
                                  <CurrencyFormatter value={rowValues[index]} currency={'USD'} disabled/>
                                </b>
                              </TableCell>
                            )
                          })
                        }
                          <TableCell className={classes.tableHeaders}>
                            <b>
                              <CurrencyFormatter value={rowValues.reduce((partialSum, a) => partialSum + a, 0)} currency={'USD'} disabled/>
                            </b>
                          </TableCell>

                          {(()=>{
                            values.totals.push(rowValues);
                          })()}
                       </TableRow>
                     )
                     
                    })}
                    <TableRow className={classes.tableHeaders}>
                      <TableCell><b>Total</b></TableCell>

                      {sessions.map((session, index)=>{
                        let sum = 0;
                        for(let i = 0; i<values.totals.length; i++){
                          sum+=values.totals[i][index];
                        }
                        return (
                          <TableCell>
                            <b>
                              <CurrencyFormatter value={sum} currency={'USD'} disabled/>
                            </b>
                          </TableCell>
                        )
                      })}
                      
                      {(()=>{
                        let sum = 0;
                        values.totals.map(row=>{
                          return row?.map(field=>{
                            return sum+=field
                          })
                        })
                        return (
                          <TableCell>
                            <b>
                              <CurrencyFormatter value={sum} currency={'USD'} disabled/>
                            </b>
                          </TableCell>
                        )
                      })()}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

          </Box>
          </>
        }
      </Box>
    );
  }
  
  export default SystemData;