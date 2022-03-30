import React, { useState, useEffect } from 'react';

import {useParams} from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import Alert from '@mui/material/Alert';
import {makeStyles} from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import HeaderDetails from '../../Components/HeaderDetails';
import SystemData from '../../Components/SystemData';
import PhysicalCards from '../../Components/PhysicalCards';
import PhysicalCash from '../../Components/PhysicalCash';
import PhysicalCashOut from '../../Components/PhysicalCashOut';
import PhysicalCashIn from '../../Components/PhysicalCashIn';
import PhysicalPayByPhone from '../../Components/PhysicalPayByPhone';
import BankDetails from '../../Components/BankDetails';
import PayByPhoneDetails from '../../Components/PayByPhoneDetails';
import SummaryDetails from '../../Components/SummaryDetails';

import {storeState, selectedStoreState, zheaderIdState, selectedDateState} from '../../states';
import {supabase} from "../../Configs/supabase"



const useStyles = makeStyles({
  viewCenter: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)'
  }
 });


 

const ZReport = (props)=>{

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState(null);
  const [savedChanges, setSavedChanges] = useState(null);
  const [openSummary, setOpenSummary] = useState(false);
  const selectedStore = selectedStoreState.useState(s=>s);
  const zheader_id = zheaderIdState.useState(s=>s);
  const store = storeState.useState(s=>s);
  const selectedDate = selectedDateState.useState(s=>s)
  const classes = useStyles();
  const handleOpenSummary = ()=>{
    setOpenSummary(!openSummary);
  }



  useEffect(()=>{
    (async ()=>{
      Promise.allSettled([


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

      ]).finally(()=>{
        setLoading(false)
      })
     
    })();
    
  },[selectedStore])

  return (
    <>
    <Box>
      {loading? <Box className={classes.viewCenter}><CircularProgress /></Box>
      :
      <>
        <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Typography variant="h4" gutterBottom component="div">
            {selectedStore} | {selectedDate}
          </Typography>
          <Box>
            <Button onClick={handleOpenSummary}>
                View Summary
            </Button>
          </Box> 

        </Box>
        <Box>
          <HeaderDetails selectedStore={selectedStore} zheader={zheader_id} />

          <Accordion TransitionProps={{mountOnEnter: true}}>
            <AccordionSummary>
              <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Typography variant="h6" gutterBottom component="div">
                      Z Details
                  </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <SystemData store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
            </AccordionDetails>
          </Accordion>

          <Accordion TransitionProps={{mountOnEnter: true}}>
            <AccordionSummary>
              <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Typography variant="h6" gutterBottom component="div">
                      Physical Cards
                  </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <PhysicalCards store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
            </AccordionDetails>
          </Accordion>

          <Accordion TransitionProps={{mountOnEnter: true}}>
            <AccordionSummary>
              <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Typography variant="h6" gutterBottom component="div">
                      Physical Cash
                  </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <PhysicalCash store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
            </AccordionDetails>
          </Accordion>

          <Accordion TransitionProps={{mountOnEnter: true}}>
            <AccordionSummary>
              <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Typography variant="h6" gutterBottom component="div">
                      Physical Cash Out
                  </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <PhysicalCashOut store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
            </AccordionDetails>
          </Accordion>

          <Accordion TransitionProps={{mountOnEnter: true}}>
            <AccordionSummary>
              <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Typography variant="h6" gutterBottom component="div">
                      Physical Cash In
                  </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <PhysicalCashIn store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
            </AccordionDetails>
          </Accordion>
          
          <Accordion TransitionProps={{mountOnEnter: true}}>
            <AccordionSummary>
              <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Typography variant="h6" gutterBottom component="div">
                      Physical Pay-by-phone
                  </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <PhysicalPayByPhone store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
            </AccordionDetails>
          </Accordion>
          
          <Accordion TransitionProps={{mountOnEnter: true}}>
            <AccordionSummary>
              <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Typography variant="h6" gutterBottom component="div">
                      Bank Details
                  </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <BankDetails store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
            </AccordionDetails>
          </Accordion>

          <Accordion TransitionProps={{mountOnEnter: true}}>
            <AccordionSummary>
              <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Typography variant="h6" gutterBottom component="div">
                    Pay-by-phone Details
                  </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <PayByPhoneDetails store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id} setSavedChanges={setSavedChanges} />
            </AccordionDetails>
          </Accordion>
          
          <SummaryDetails store={store} open={openSummary} handleModal={handleOpenSummary} zheader={zheader_id} />
        </Box>
      </>}
    </Box>
   
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={savedChanges !== null}
      TransitionComponent={Grow}
      autoHideDuration = {savedChanges === true ? 3000 : null}
      onClose={()=>setSavedChanges(null)}
    >
      <Alert severity={savedChanges === true ? 'success' : 'info'}>{savedChanges === true ? 'Saved!' : 'Saving...!'}</Alert>
    </Snackbar>
    </>
  );
}

export default ZReport;