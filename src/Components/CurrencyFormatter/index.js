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
    const { value = 0, currency = 'USD', disabled = false, onChange=()=>{}, isCurrency = true} = props;
    const classes = useStyles();
        
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
                inputComponent: isCurrency? NumberFormatCustom : null,
                disableUnderline: true
            }}

            variant="standard"
        />
      
    )
  }

  export default CurrencyFormatter