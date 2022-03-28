import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import Alert from '@mui/material/Alert';





import SystemData from '../SystemData/';
import PhysicalCards from '../PhysicalCards';
import PhysicalCash from '../PhysicalCash';
import PhysicalCashOut from '../PhysicalCashOut';
import PhysicalPayByPhone from '../PhysicalPayByPhone';
import BankDetails from '../BankDetails';
import PayByPhoneDetails from '../PayByPhoneDetails';
import SummaryDetails from '../SummaryDetails';

import {storeState} from '../../states';
import {supabase} from "../../Configs/supabase"



const ZReport = (props)=>{

  const {selectedDate='2022-03-07', zheader_id=1} = props;
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [savedChanges, setSavedChanges] = useState(null);
  const [openSummary, setOpenSummary] = useState(false);

  const store = storeState.useState(s=>s);

  const handleOpenSummary = ()=>{
    setOpenSummary(!openSummary);
  }

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
    <>
    <Box>
      {loading? <Skeleton variant="text" width={200} height={40}/> 
      :<Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Typography variant="h4" gutterBottom component="div">
          {selectedStore} | {selectedDate}
        </Typography>
        <Box>
          <Button onClick={handleOpenSummary}>
              View Summary
          </Button>
        </Box>
        {/* <Box sx={{display: 'flex'}}>
          {savedChanges === null && <Typography variant="subtitle1" gutterBottom component="div">No Chages made</Typography>}
          {savedChanges === false && <Typography variant="subtitle1" gutterBottom component="div"><CircularProgress size={20} /> Saving...</Typography>}
          {savedChanges === true && <Typography variant="subtitle1" gutterBottom component="div"><CheckIcon/>Saved</Typography>}
        </Box> */}
      </Box>}
      <Box>
        <SystemData store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
        <PhysicalCards store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
        <PhysicalCash store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
        <PhysicalCashOut store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
        <PhysicalPayByPhone store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
        <BankDetails store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
        <PayByPhoneDetails store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
        <SummaryDetails store={store} open={openSummary} handleModal={handleOpenSummary} zheader={zheader_id}/>
      </Box>
    </Box>
    {savedChanges === false && <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={savedChanges === false}
      TransitionComponent={Grow}
    >
      <Alert severity='info'>Saving...!</Alert>
    </Snackbar>}
    {savedChanges === true && <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={savedChanges === true}
      TransitionComponent={Grow}
      autoHideDuration = {3000}
    >
      <Alert severity='success'>Saved!</Alert>
    </Snackbar>}
    </>
  );
}

export default ZReport;