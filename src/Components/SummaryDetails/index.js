import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';


import {supabase} from "../../Configs/supabase"

import getSymbolFromCurrency from 'currency-symbol-map';


const getPaymentTotal = (rows = [])=>{
    return rows.reduce((partialSum, a) => partialSum + a.amount_1, 0)
}

const getBankingTotal = (rows = [])=>{

    return rows.reduce((partialSum, row) => {
        const value = row.count*row.domination/row.rate.rate
        return partialSum + value
    }, 0)
}


const SummaryDetails = (props)=> {

    const {open, handleModal, zheader, store} = props

    const [loading, setLoading] = useState(true);
    const [zheaderDetails, setZheaderDetails] = useState([]);
    const [zPhysicalCards, setZPhysicalCards] = useState([]);
    const [zPhysicalPayByPhone, setZPhysicalPayByPhone] = useState([]);
    const [zPhysicalCash, setZPhysicalCash] = useState([]);
    const [zPhysicalCashOut, setZPhysicalCashOut] = useState([]);
    const [zPhysicalCashIn, setZPhysicalCashIn] = useState([]);
    const [currency,setCurrency] = useState(null);
    const [zDetails, setZDetails] = useState([]);
    const [pbpBanks, setPbpBanks] = useState([]);
    const [cardBanks, setCardBanks] = useState([]);
    const [zBankDetails, setZBankDetails] = useState([]);
    const [zPayByPhoneDetails, setZPayByPhoneDetails] = useState([]);
    let totalSales = zDetails.reduce((partialSum, a) => partialSum + a.amount_1, 0)
    let netSales = Math.round((totalSales/1.16 + Number.EPSILON) * 100) / 100;
    let vat = Math.round((netSales*0.16 + Number.EPSILON) * 100) / 100;
    let UPT = Math.round((zheaderDetails?.total_quantity/zheaderDetails?.transaction_count + Number.EPSILON) * 100) / 100;
    let ATV = Math.round((totalSales/zheaderDetails?.transaction_count + Number.EPSILON) * 100) / 100;
    let conversion_percentage = Math.round((zheaderDetails?.transaction_count/zheaderDetails?.people_count + Number.EPSILON) * 100);
    let zCashSales = getPaymentTotal(zDetails.filter(row=>row.ptid === 4) )
    let zCardsTotal = getPaymentTotal(zDetails.filter(row=>[5,6,7].includes(row.ptid)))
    let zPayByPhoneTotal = getPaymentTotal(zDetails.filter(row=>row.ptid === 8));
    let zPhysialVisaTotal = getPaymentTotal(zPhysicalCards.filter(row=>row.ptid === 5))
    let zPhysialMasterTotal = getPaymentTotal(zPhysicalCards.filter(row=>row.ptid === 6))
    let zPhysialOtherCardsTotal = getPaymentTotal(zPhysicalCards.filter(row=>row.ptid === 7))
    let zPhysicalCardsTotal = zPhysialVisaTotal + zPhysialMasterTotal + zPhysialOtherCardsTotal;
    let zPhysicalPayByPhoneTotal =  getPaymentTotal(zPhysicalPayByPhone)
    let zPhysicalCashTotal = getBankingTotal(zPhysicalCash) + getBankingTotal(zPhysicalCashOut) + getBankingTotal(zPhysicalCashIn)
    let cashDifference =  Math.round((zPhysicalCashTotal-zCashSales + Number.EPSILON) * 100) / 100;
    let cardsDifference = Math.round((zPhysicalCardsTotal-zCardsTotal + Number.EPSILON) * 100) / 100;
    let payByPhoneDifference = Math.round((zPhysicalPayByPhoneTotal-zPayByPhoneTotal + Number.EPSILON) * 100) / 100;
    let totalDifference = Math.round(( cashDifference + cardsDifference + payByPhoneDifference + Number.EPSILON) * 100) / 100;

    
    
    
    const fetchData = async ()=>{
        Promise.allSettled([

            // (async ()=>{
            //     await supabase.from('payment_types').select('*').in('id', [4]).then(({data})=>{
            //         if(data){
            //         }
            //     })
            // })(),
            (async ()=>{
                // const {data, error} = await supabase.from('currencies').select('*').equ('id', await (await supabase.from('countries').select('*').eq('id', store.country)).data[0].currencies)
                await supabase.from('countries').select('*').eq('id', store.country).then(async ({data})=>{
                    if(data){
                        await supabase.from('currencies').select('*').eq('id', data[0].currencies[0]).then(({data})=>{
                            if(data) {
                                setCurrency(getSymbolFromCurrency(data[0].code));
                            }
                        })
                    }
                })
            })(),

            zheader && (async ()=>{
                const {data} = await supabase.from('z_header').select('*').eq('id', zheader);
                if(data){
                    setZheaderDetails(data[0]);
                }
            })(),

            zheader && (async ()=>{
                const {data, error} = await supabase.from('z_details').select('*').eq('zheader_id', zheader);
                if(data){
                    setZDetails(data);
                }
                if(error){
                    console.log(error);
                }
            })(),

            zheader && (async ()=>{
                const {data, error} = await supabase.from('z_physical_cards').select('*').eq('zheader_id', zheader);
                if(data){
                    setZPhysicalCards(data);
                }
                if(error){
                    console.log(error);
                }
            })(),
            
            zheader && (async ()=>{
                const {data, error} = await supabase.from('z_physical_pbp').select('*').eq('zheader_id', zheader);
                if(data){
                    setZPhysicalPayByPhone(data);
                }
                if(error){
                    console.log(error);
                }
            })(),
            
            zheader && (async ()=>{
                const {data, error} = await supabase.from('z_physical_cash').select('*, rate(*)').eq('zheader_id', zheader);
                if(data){
                    setZPhysicalCash(data);
                }
                if(error){
                    console.log(error);
                }
            })(),
            zheader && (async ()=>{
                const {data, error} = await supabase.from('z_physical_cash_out').select('*, rate(*)').eq('zheader_id', zheader);
                if(data){
                    setZPhysicalCashOut(data);
                }
                if(error){
                    console.log(error);
                }
            })(),
            zheader && (async ()=>{
                const {data, error} = await supabase.from('z_physical_cash_in').select('*, rate(*)').eq('zheader_id', zheader);
                if(data){
                    setZPhysicalCashIn(data);
                }
                if(error){
                    console.log(error);
                }
            })(),

            (async ()=>{
                const {data, error} = await supabase.from('pay_by_phone_banks').select('*');
                if(data){
                    setPbpBanks(data);
                }
                if(error){
                    console.log(error);
                }
            })(),
            
            (async ()=>{
                const {data, error} = await supabase.from('banks').select('*');
                if(data){
                    setCardBanks(data);
                }
                if(error){
                    console.log(error);
                }
            })(),

            zheader && (async ()=>{
                const {data, error} = await supabase.from('z_pbp_details').select('*').eq('zheader_id', zheader);
                if(data){
                    setZPayByPhoneDetails(data);
                }
                if(error){
                    console.log(error);
                }
            })(),
            
            zheader && (async ()=>{
                const {data, error} = await supabase.from('z_bank_details').select('*').eq('zheader_id', zheader);
                if(data){
                    setZBankDetails(data);
                }
                if(error){
                    console.log(error);
                }
            })(),
        ]).finally(()=>{
            setLoading(false)
        })
    } 

    
    
    useEffect(fetchData, [])
  

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleModal}
        maxWidth='sm'
        fullWidth
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Summary</DialogTitle>
        <DialogContent dividers>
          {/* <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          > */}
              {loading? <Skeleton variant="text" width={200} height={40}/>:
            
                <TableContainer>
                    <Table size='small'>
                        <TableBody>
                            <TableRow hover key='target'>
                                <TableCell><b>Target</b></TableCell>
                                <TableCell>{currency}{(zheaderDetails.target)?.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            <TableRow hover key='total-sales'>
                                <TableCell><b>Total Sales</b></TableCell>
                                <TableCell>{currency}{totalSales.toLocaleString('en-US')}</TableCell>
                            </TableRow >
                            <TableRow hover key='net-sales'>
                                <TableCell><b>Net Sales</b></TableCell>
                                <TableCell>{currency}{netSales.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            <TableRow hover key='vat'>
                                <TableCell><b>VAT</b></TableCell>
                                <TableCell>{currency}{vat.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            <TableRow hover key='total-qty'>
                                <TableCell><b>Total Qty.</b></TableCell>
                                <TableCell>{zheaderDetails?.total_quantity}</TableCell>
                            </TableRow>
                            <TableRow hover key='upt'>
                                <TableCell><b>UPT</b></TableCell>
                                <TableCell>{UPT}</TableCell>
                            </TableRow>
                            <TableRow hover key='atv'>
                                <TableCell><b>ATV</b></TableCell>
                                <TableCell>{currency}{ATV.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            
                            <TableRow><TableCell colSpan={2}></TableCell></TableRow>

                            <TableRow hover key='conversion'>
                                <TableCell><b>Conversion %</b></TableCell>
                                <TableCell>{conversion_percentage}%</TableCell>
                            </TableRow>

                            <TableRow><TableCell colSpan={2}></TableCell></TableRow>

                            <TableRow hover key='cash-sales'>
                                <TableCell><b>Cash Sales (From Z-Report)</b></TableCell>
                                <TableCell>{currency}{zCashSales.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                          
                            <TableRow hover key='visa'>
                                <TableCell><b>Visa</b></TableCell>
                                <TableCell>{currency}{zPhysialVisaTotal.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            
                            <TableRow hover key='master'>
                                <TableCell><b>Master</b></TableCell>
                                <TableCell>{currency}{zPhysialMasterTotal.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            
                            <TableRow hover key='other-cards'>
                                <TableCell><b>Other Cards</b></TableCell>
                                <TableCell>{currency}{zPhysialOtherCardsTotal.toLocaleString('en-US')}</TableCell>
                            </TableRow>

                            <TableRow hover key='pbp'>
                                <TableCell><b>Pay By Phone</b></TableCell>
                                <TableCell>{currency}{zPhysicalPayByPhoneTotal.toLocaleString('en-US')}</TableCell>
                            </TableRow>

                            <TableRow hover key='cards-total'>
                                <TableCell><b>( Credit / Debit ) Cards Total</b></TableCell>
                                <TableCell>{currency}{zCardsTotal.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            
                            
                            <TableRow hover key='banking-amount'>
                                <TableCell><b>Banking amount (Physical)</b></TableCell>
                                <TableCell>{currency}{zPhysicalCashTotal.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            
                            <TableRow hover key='pbp-diff'>
                                <TableCell><b>Pay By Phone Difference</b></TableCell>
                                <TableCell>{currency}{payByPhoneDifference.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            
                            <TableRow hover key='cash-diff'>
                                <TableCell><b>Cash Difference</b></TableCell>
                                <TableCell>{currency}{cashDifference.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            
                            <TableRow hover key='cards-diff'>
                                <TableCell><b>Cards Difference</b></TableCell>
                                <TableCell>{currency}{cardsDifference.toLocaleString('en-US')}</TableCell>
                            </TableRow>
                            
                            <TableRow hover key='total-diff'>
                                <TableCell><b>Total Difference</b></TableCell>
                                <TableCell>{currency}{totalDifference.toLocaleString('en-US')}</TableCell>
                            </TableRow>

                            <TableRow><TableCell colSpan={2}></TableCell></TableRow>

                            {pbpBanks.map((bank,index)=>{
                                const bankRows = zPayByPhoneDetails.filter(row=>row.pay_by_phone_id === bank.id);
                                const total = bankRows.reduce((partialSum, a) => partialSum + a.value, 0);
                                return (
                                <TableRow key={`pbp-total-${index}`}>
                                    <TableCell><b>{bank.description}</b></TableCell>
                                    <TableCell>{currency}{total.toLocaleString('en-US')}</TableCell>
                                </TableRow>
                                )
                            })}

                            {cardBanks.map((bank,index)=>{
                                const bankRows = zBankDetails.filter(row=>row.bank_id === bank.id);
                                const total = bankRows.reduce((partialSum, a) => partialSum + a.value, 0);
                                return (
                                <TableRow hover key={`card-total-${index}`}>
                                    <TableCell><b>{bank.description}</b></TableCell>
                                    <TableCell>{currency}{total.toLocaleString('en-US')}</TableCell>
                                </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SummaryDetails;