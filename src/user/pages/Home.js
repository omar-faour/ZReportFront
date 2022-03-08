import React, { useEffect, useState, useContext, } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Employee from '../../places/pages/employee';
import EditIcon from '@material-ui/icons/Edit'
import Paper from '@material-ui/core/Paper';
import url from '../../shared/util/URL';

const columns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phoneNumber", headerName: "Phone", flex: 1, },
  { field: "location", headerName: "Site", flex: 1, },
  { field: "department", headerName: "Department", flex: 1 },
  { field: "position", headerName: "Position", flex: 1, }
];



function createData(name, email, phoneNumber, location, department, position, id) {
  return { name, email, phoneNumber, location, department, position, id };
}


const Home = () => {

  const history = useHistory();
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const [userId, setUserId] = useState(null)
  const [rows, setRows] = useState([])
  const handleModalOpen = (id) => {
    setUserId(id)
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };




  const handleClick = (id) => {
    history.push('/employee/' + id);
  };

  const handleEdit = (id) => {
    console.log(id);
    history.push('/edit-employee/' + id);
  }



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          url+ '/api/places/employees'
        );
        let data = responseData.employees;
        console.log(data)
        setLoadedEmployees(data);
      } catch (err) {
        console.log("Fetch Users Error: ", err)
      }
    };
    fetchUsers();
  }, [sendRequest]);


useEffect(()=>{
  let temp = [];
  console.log(12585522215165262555369526050250000235)
  console.log(loadedEmployees)
  if(loadedEmployees.length > 0 ){
    loadedEmployees.map(element => {
    console.log(element)
    console.log("JJKKKJJJKKKIIIIGGGGFFFFDDDSSSS")
    temp.push(createData(element.name,
      element.email,
      element.phoneNumber,
      element.location,
      element.department,
      element.position ? element.position[element.position.length - 1] : "",
      element._id))
  });

    console.log(loadedEmployees)
    setRows(temp)
  
}
}, [loadedEmployees])
  



  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading &&
        <Backdrop open={isLoading} >
          <LoadingSpinner />
        </Backdrop>
      }



      <Grid container direction="rows"
        justify="center"
        alignItems="center">
        <Grid item xs={10} sm={8} md={10}>
          <Paper elevation={3} style={{ margin: 10 }}>
            <DataGrid
              onRowClick={(row) => handleModalOpen(row.id)}
              autoHeight={true}
              rows={rows} columns={columns}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Paper>
        </Grid>
      </Grid>


      <Dialog
        fullWidth={fullWidth}
        open={open}
        onClose={handleModalClose}
        aria-labelledby="max-width-dialog-title"
      >

        <DialogContent>
          <Employee id={userId} />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleEdit(userId)} color="secondary" startIcon={<EditIcon />}>
            Edit
          </Button>
          <Button onClick={handleModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment >
  );
};


const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));

export default Home;
