import React, { useState } from 'react';

import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles';
import NumberFormat from 'react-number-format';
import getSymbolFromCurrency from 'currency-symbol-map';

import {supabase} from '../../Configs/supabase';

const useStyles = makeStyles({
    
})



const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {

    const {onChange, currency, ...other } = props;
    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        prefix={getSymbolFromCurrency(props.currency)}
      />
    );
  });
  

const CurrencyFormatter = (props)=>{
    const { value = 0, currency = 'USD', disabled = false, onChange=()=>{}} = props;
    const classes = useStyles();

    // const onChange = async (e)=>{

    //     const updatedDetails = {}

    //     if(row.amount_f === row.amount_1){
    //         updatedDetails['amount_f'] = e.target.value
    //         updatedDetails['amount_1'] = e.target.value
    //         updatedDetails['amount_2'] = e.target.value * row.rate.rate;
    //     }else if(row.amount_f === row.amount_2){
    //         updatedDetails['amount_f'] = e.target.value
    //         updatedDetails['amount_2'] = e.target.value
    //         updatedDetails['amount_1'] = e.target.value/row.rate.rate;
    //     }else if(row.amount_f !== row.amount_1 && row.amount_f !== row.amount_2){
    //         const rate_1_Value = row.rate.rate;
    //         const amount_1 = e.target.value*rate_1_Value;
    //         if(rate_2){
    //             const rate_2_value = rate_2[0].rate;
    //             const amount_2 = amount_1 * rate_2_value;

    //             updatedDetails['amount_f'] = e.target.value
    //             updatedDetails['amount_1'] = amount_1
    //             updatedDetails['amount_2'] = amount_2;
    //         }
    //     }
        
    //     // const{data, error} = await supabase.from('z_details').upsert({...row, amount_f: e.target.value, amount_1: amount_1, amount_2: amount_2}).eq('id', row.id);

    //     setRows(oldRows=>{
    //         const filteredRows = oldRows.filter(oldRow=>oldRow.id !== row.id)
    //         return [...filteredRows, {...row, ...updatedDetails}]
    //     })
        


    // }
    return (

        <TextField
            disabled = {disabled}
            value={value}
            // onChange={onChange}
            onBlur={onChange}
            size="small"
            inputProps={{          
                'currency': currency,                
              }}
            InputProps={{
                inputComponent: NumberFormatCustom,
                disableUnderline: true
            }}

            variant="standard"
        />
      
    )
  }

  export default CurrencyFormatter