import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ErrorModal from '../UIElements/ErrorModal';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import SimpleTable from '../UIElements/SimpleTable'
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { useAuth } from '../../hooks/auth-hook';
import Grid from '@material-ui/core/Grid'
import url from '../../util/URL'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    // width: '60%',
    margin: '0 auto'
  },

}));

export default function SimpleTabs({ eid }) {
  const auth = useAuth(AuthContext);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [loadedEmployee, setLoadedEmployee] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //const empId = useParams().eid;
  const empId = eid;
  console.log(eid)
  useEffect(() => {
    const fetchPlaces = async () => {
      try {

        if (eid !== "false") {
          const responseData = await sendRequest(
            url+`/api/places/employee/` + eid,
          );
          setLoadedEmployee(responseData.employee);
          console.log("Employee: ", responseData.employee)
        }
      } catch (err) {
        console.log("LLLLLKKKKKKKKJJJJJJJ")
        console.log(err)
      }
    };

    fetchPlaces();

  }, [sendRequest, empId]);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>

      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedEmployee && (
        <Grid container
          direction="row"
          justify="center"
          alignItems="center">

          {loadedEmployee.status !== "married" &&
            <Grid item xs={12} >
              <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="scrollable"
                  scrollButtons="auto">
                  <Tab label="Personal Information" wrapped {...a11yProps(0)} />
                  <Tab label="Residency" wrapped {...a11yProps(3)} />
                  <Tab label="Education" wrapped {...a11yProps(1)} />
                  <Tab label="Job and Salary" wrapped {...a11yProps(2)} />
                  <Tab label="Vacation" wrapped {...a11yProps(4)} />
                </Tabs>
              </AppBar>
            </Grid>
          }
          {loadedEmployee.status === "married" &&
            <Grid item xs={12} >
              <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="scrollable"
                  scrollButtons="auto">
                  <Tab label="Personal Information" wrapped {...a11yProps(0)} />
                  <Tab label="Residency" wrapped {...a11yProps(4)} />
                  <Tab label="Family" wrapped {...a11yProps(1)} />
                  <Tab label="Education" wrapped {...a11yProps(2)} />
                  <Tab label="Job and Salary" wrapped {...a11yProps(3)} />
                  <Tab label="Vacation" wrapped {...a11yProps(5)} />
                </Tabs>
              </AppBar>
            </Grid>
          }
          {loadedEmployee.status !== "married" &&
            <Grid item xs={12} >
              <TabPanel value={value} index={0}>
                <SimpleTable data={loadedEmployee} section="personal" />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <SimpleTable data={loadedEmployee} section="verification" />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <SimpleTable data={loadedEmployee} section="education" />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <SimpleTable data={loadedEmployee} section="job" />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <SimpleTable data={loadedEmployee} section="vacation" />
              </TabPanel>
            </Grid>
          }

          {loadedEmployee.status === "married" &&
            <Grid item xs={12} >
              <TabPanel value={value} index={0}>
                <SimpleTable data={loadedEmployee} section="personal" />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <SimpleTable data={loadedEmployee} section="verification" />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <SimpleTable data={loadedEmployee} section="family" />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <SimpleTable data={loadedEmployee} section="education" />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <SimpleTable data={loadedEmployee} section="job" />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <SimpleTable data={loadedEmployee} section="vacation" />
              </TabPanel>
            </Grid>
          }
        </Grid>
      )}

    </div>
  );
}
