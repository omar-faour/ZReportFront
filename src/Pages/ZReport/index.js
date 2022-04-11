import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import {makeStyles} from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import SaveIcon from '@mui/icons-material/Save';



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

import {storeState, selectedStoreState, zheaderIdState, selectedDateState, toBeSavedState} from '../../states';
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
  const [changesCounter, setChangesCounter] = useState(0);
  const [savingChanges, setSavingChanges] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const selectedStore = selectedStoreState.useState(s=>s);
  const zheader_id = zheaderIdState.useState(s=>s);
  const store = storeState.useState(s=>s);
  const selectedDate = selectedDateState.useState(s=>s)
  const toBeSaved = toBeSavedState.useState(s=>s);
  const classes = useStyles();
  
  const handleOpenSummary = ()=>{
    setOpenSummary(!openSummary);
  }

 

  const saveChanges = async ()=>{
    console.log("FIRED")
    console.log("COUNTER: ", changesCounter)
    if(changesCounter > 0)
      {
        console.log("IN-FIRED")
        setSavingChanges(true)
        Promise.allSettled([
          // headerDetails: {},
          Object.keys(toBeSaved.headerDetails).length > 0 && (async()=>{ 
            await supabase.from('z_header').update(toBeSaved.headerDetails).eq('id', toBeSaved.headerDetails.id)
            .then(({data, error})=>{
              if(data){
                 toBeSavedState.update(s=>{s.headerDetails = {}});
              }
              if(error){
                console.log(error);
              }
            }) 
          })(),
          
          // bankDetails: [],
          toBeSaved.bankDetails.length > 0 && (async()=>{
            //INSERT: 
              const insertRows =  toBeSaved.bankDetails.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('z_bank_details').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.bankDetails = s.bankDetails.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });            
            //UPDATE: 
              const updateRows = toBeSaved.bankDetails.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('z_bank_details').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.bankDetails = s.bankDetails.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),
          
          // payByPhoneDetails: [],
          toBeSaved.payByPhoneDetails.length > 0 && (async()=>{
            //INSERT: 
              const insertRows =  toBeSaved.payByPhoneDetails.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('z_pbp_details').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.payByPhoneDetails = s.payByPhoneDetails.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });          
            //UPDATE: 
              const updateRows = toBeSaved.payByPhoneDetails.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('z_pbp_details').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.payByPhoneDetails = s.payByPhoneDetails.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),

          // physicalCards: [],
          toBeSaved.physicalCards.length > 0 && (async()=>{
            //INSERT:
              const insertRows =  toBeSaved.physicalCards.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('z_physical_cards').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.physicalCards = s.physicalCards.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });    
            //UPDATE:
              const updateRows = toBeSaved.physicalCards.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('z_physical_cards').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.physicalCards = s.physicalCards.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),

          // physicalCash: [],
          toBeSaved.physicalCash.length > 0 && (async()=>{
            //INSERT:
              const insertRows =  toBeSaved.physicalCash.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('z_physical_cash').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.physicalCash = s.physicalCash.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });       
            //UPDATE:
              const updateRows = toBeSaved.physicalCash.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('z_physical_cash').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.physicalCash = s.physicalCash.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),
         
          // physicalCashIn: [],
          toBeSaved.physicalCashIn.length > 0 && (async()=>{
            //INSERT: 
              const insertRows =  toBeSaved.physicalCashIn.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('z_physical_cash_in').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.physicalCashIn = s.physicalCashIn.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });      
            //UPDATE: 
              const updateRows = toBeSaved.physicalCashIn.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('z_physical_cash_in').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.physicalCashIn = s.physicalCashIn.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),

          // physicalCashInNotes: [],
          toBeSaved.physicalCashInNotes.length > 0 && (async()=>{
            //INSERT: 
              const insertRows =  toBeSaved.physicalCashInNotes.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('cash_in_notes').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.physicalCashInNotes = s.physicalCashInNotes.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });           
            //UPDATE: 
              const updateRows = toBeSaved.physicalCashInNotes.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('cash_in_notes').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.physicalCashInNotes = s.physicalCashInNotes.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),

          // physicalCashOut: [],
          toBeSaved.physicalCashOut.length > 0 && (async()=>{
            //INSERT: 
              const insertRows =  toBeSaved.physicalCashOut.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('z_physical_cash_out').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.physicalCashOut = s.physicalCashOut.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });           
            //UPDATE: 
              const updateRows = toBeSaved.physicalCashOut.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('z_physical_cash_out').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.physicalCashOut = s.physicalCashOut.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),

          // physicalCashOutNotes: [],
          toBeSaved.physicalCashOutNotes.length > 0 && (async()=>{
            //INSERT: 
              const insertRows =  toBeSaved.physicalCashOutNotes.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('cash_out_notes').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.physicalCashOutNotes = s.physicalCashOutNotes.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });        
            //UPDATE: 
              const updateRows = toBeSaved.physicalCashOutNotes.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('cash_out_notes').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.physicalCashOutNotes = s.physicalCashOutNotes.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),

          // physicalPayByPhone: [],
          toBeSaved.physicalPayByPhone.length > 0 && (async()=>{
            //INSERT: 
              const insertRows =  toBeSaved.physicalPayByPhone.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('z_physical_pbp').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.physicalPayByPhone = s.physicalPayByPhone.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              });       
            //UPDATE: 
              const updateRows = toBeSaved.physicalPayByPhone.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('z_physical_pbp').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.physicalPayByPhone = s.physicalPayByPhone.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
          })(),
          
          // systemData: []
          toBeSaved.systemData.length > 0 && (async()=>{
            //INSERT: 
              const insertRows = toBeSaved.systemData.filter(row=>row.method === 'insert');
              const insertValues = [...insertRows.map(row=>({...row.values}))]
              await supabase.from('z_details').insert(insertValues)
              .then(({data, error})=>{
                if(data){
                  toBeSavedState.update(s=>{s.systemData = s.systemData.filter(row=>row.method !== 'insert')})
                }
                if(error){
                  console.log(error)
                }
              }); 
            //UPDATE: 
              const updateRows = toBeSaved.systemData.filter(row=>row.method === 'update');
              updateRows.map(async row=>{
                return await supabase.from('z_details').update(row.values).eq('id', row.id)
                .then(({data, error})=>{
                  if(data){
                    toBeSavedState.update(s=>{s.systemData = s.systemData.filter(row_a=>row_a.id !== row.id)})
                  }
                  if(error){
                    console.log(error);
                  }
                });
              })
              
          })(),
        ]).finally(()=>{
          setSavingChanges(false)
        })
  }
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

  

  useEffect(()=>{
    // let value = (Object.keys(toBeSaved.headerDetails).length > 0 ? Object.keys(toBeSaved.headerDetails).length - 1 : 0) + toBeSaved.bankDetails.length + toBeSaved.payByPhoneDetails.length + toBeSaved.physicalCards.length + toBeSaved.physicalCash.length + toBeSaved.physicalCashIn.length + toBeSaved.physicalCashInNotes.length + toBeSaved.physicalCashOut.length + toBeSaved.physicalCashOutNotes.length + toBeSaved.physicalPayByPhone.length + toBeSaved.systemData.length;
    // setChangesCounter(value);
    setChangesCounter((Object.keys(toBeSaved.headerDetails).length > 0 ? Object.keys(toBeSaved.headerDetails).length - 1 : 0) + toBeSaved.bankDetails.length + toBeSaved.payByPhoneDetails.length + toBeSaved.physicalCards.length + toBeSaved.physicalCash.length + toBeSaved.physicalCashIn.length + toBeSaved.physicalCashInNotes.length + toBeSaved.physicalCashOut.length + toBeSaved.physicalCashOutNotes.length + toBeSaved.physicalPayByPhone.length + toBeSaved.systemData.length)
    // console.log("COUNTER: ", value)
  }, [toBeSaved]);


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
            <LoadingButton
              onClick={saveChanges}
              loading={savingChanges}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
              disabled={!(changesCounter > 0)}
            >
              Save Changes
            </LoadingButton>
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
              <SystemData store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id}  />
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
              <PhysicalCards store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id}  />
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
              <PhysicalCash store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id}  />
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
              <PhysicalCashOut store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id}  />
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
              <PhysicalCashIn store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id}  />
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
              <PhysicalPayByPhone store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id}  />
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
              <BankDetails store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id}  />
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
              <PayByPhoneDetails store={store} selectedStore={selectedStore} sessions={sessions} zheader={zheader_id}  />
            </AccordionDetails>
          </Accordion>
          
          <SummaryDetails store={store} open={openSummary} handleModal={handleOpenSummary} zheader={zheader_id} />
        </Box>
      </>}
    </Box>
   
    {/* <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={savedChanges !== null}
      TransitionComponent={Grow}
      autoHideDuration = {savedChanges === true ? 3000 : null}
      onClose={()=>setSavedChanges(null)}
    >
      <Alert severity={savedChanges === true ? 'success' : 'info'}>{savedChanges === true ? 'Saved!' : 'Saving...!'}</Alert>
    </Snackbar> */}
    </>
  );
}

export default ZReport;