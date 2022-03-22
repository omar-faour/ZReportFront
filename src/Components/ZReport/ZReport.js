import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';



import SystemData from '../SystemData/';
import PhysicalCards from '../PhysicalCards';
import PhysicalCash from '../PhysicalCash';

import {storeState} from '../../states';
import {supabase} from "../../Configs/supabase"



const ZReport = (props)=>{

  const {selectedDate='2022-03-07'} = props;
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [savedChanges, setSavedChanges] = useState(null);
  const store = storeState.useState(s=>s);

  useEffect(()=>{


    (async ()=>{
      Promise.allSettled([
        (async ()=>{
          const {data: storeData, error: storeError} = await supabase.from('stores').select('*').eq('id', store.store)
          if(storeData){
            setSelectedStore(storeData[0].code_2)
            setLoading(false);
          }
        })(),

        (async()=>{
          const {data: sessionsData, error: sessionsError} = await supabase.from('sessions').select('session_id: id, session_name: name').eq('store_code', selectedStore)
          if(sessionsData){
            let array = [];
            sessionsData.map(session=>array.push(session));
            setSessions([...array]);
          }

          if(sessionsError){
            console.log("Sessions Error: ", sessionsError)
          }
        })(),

      ])
     
    })();
    
  },[selectedStore])

  return (
    <Box>
      {loading? <Skeleton variant="text" width={200} height={40}/> 
      :<Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Typography variant="h4" gutterBottom component="div">
          {selectedStore} | {selectedDate}
        </Typography>
        <Box sx={{display: 'flex'}}>
          {savedChanges === null && <Typography variant="subtitle1" gutterBottom component="div">No Chages made</Typography>}
          {savedChanges === false && <Typography variant="subtitle1" gutterBottom component="div"><CircularProgress size={20} /> Saving...</Typography>}
          {savedChanges === true && <Typography variant="subtitle1" gutterBottom component="div"><CheckIcon/>Saved</Typography>}
        </Box>
      </Box>}
      <Box>
        <SystemData store={store} selectedStore={selectedStore} sessions={sessions} setSavedChanges={setSavedChanges}/>
        <PhysicalCards store={store} selectedStore={selectedStore} sessions={sessions} setSavedChanges={setSavedChanges}/>
        <PhysicalCash store={store} selectedStore={selectedStore} sessions={sessions} setSavedChanges={setSavedChanges}/>
      </Box>
    </Box>
  );
}

export default ZReport;