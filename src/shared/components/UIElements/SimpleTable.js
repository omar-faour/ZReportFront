import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHttpClient } from '../../hooks/http-hook';
import axios from 'axios'
import { AuthContext } from '../../context/auth-context';
import url from '../../util/URL'

const mime = require('mime-types');


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  paddingRight0: {
    width: '8rem'
  },
  marginT: {
    marginTop: 0
  }
});

let id = 0;
function createData(name, value, file) {
  id += 1;
  if (file)
    return { id, name, value, file }
  return { id, name, value };
}



function SimpleTable(props) {

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [status, setStatus] = useState('');
  function join(t, a, s) {
    function format(m) {
      let f = new Intl.DateTimeFormat('en', m);
      return f.format(t);
    }
    return a.map(format).join(s);
  }

  let a = [{ day: 'numeric' }, { month: 'short' }, { year: 'numeric' }];
  let rows;
  if (props.section === 'personal')
    rows = [
      createData('Name', props.data.name),
      createData('Gender', props.data.gender),
      createData('Date of Birth', join(new Date(props.data.dateofBirth), a, '-')),
      createData('Phone Number', props.data.phoneNumber),
      createData('Email', props.data.email),
      createData('Address', props.data.address),
      createData('Emergency Contact Number', props.data.emergencyContactNumber),
      createData('Marital Status', props.data.status),
    ];
  else if (props.section === 'education')
    rows = [
      createData('University', props.data.education.university,),
      createData('Degree', props.data.education.degree, props.data.education.file),
      createData('Resume', props.data.resume.resume, props.data.resume.file),
      createData('Experience', "",),
    ];
  else if (props.section === 'job') {
    rows = [
      createData('ID', props.data.employeeID),
      createData('Position', props.data.position),
      createData('Description', props.data.jobDescription),
      createData('Salary', props.data.salary[0].value),
      createData('Salary', props.data.salary[props.data.salary.length - 1].value),
      createData('Date of hiring', join(new Date(props.data.dateofHiring), a, '-')),
      createData('Email', props.data.email),
      createData('Employment', props.data.employment),
      createData('Department', props.data.department),
      createData('Location', props.data.location),
      createData('Insurance', props.data.insurance),
      createData('Housing', props.data.housing),
      createData('Transportation', props.data.transportation),
    ];
  } else if (props.section === 'verification') {
    rows = [
      createData('Passport Number', props.data.passport?.number, props.data.passport?.file)
    ];
  
      if(props.data.passport){
      rows.push(createData('Passport Expiry Date', join(new Date(props.data.passport?.expireyDate), a, '-')))
    }else{
      rows.push(createData('Passport Expiry Date', ''))
    }
    rows.push(createData('Visa / Residence', props.data.visa?.number, props.data.visa?.file))
    if(props.data.visa.expireyDate){
      rows.push(createData('Visa Expiry Date',join(new Date(props.data.visa?.expireyDate), a, '-')))
    }
    else{
      rows.push(createData('Visa Expiry Date', ""))
    }
    if(props.data.ticketExpireyDate){
      rows.push(createData('Ticket Expiry', join(new Date(props.data?.ticketExpireyDate), a, '-'), props.data?.ticketFile))
    }else{
      rows.push(createData('Ticket Expiry', "", props.data?.ticketFile))
    }
  } else if (props.section === 'family') {
    rows = [
      createData('Spouse Name', props.data.wifeName, props.data.familyIdFile),
      createData('Spouse Birth', join(new Date(props.data.wifeDateOfBirth), a, '-')),
      createData('Children', props.data.numberOfKids),
    /*createData('Family ID',  join(new Date(props.data.ticketExpireyDate), a, '-'), props.data.personal),*/
    ];
    for (let i = 0; i < props.data.childrenNames.names.length; i++) {
      rows.push(createData('Child' + (i + 1), props.data.childrenNames.names[i]))
      rows.push(createData('Date of Birth', props.data.childDateofBirth.dates[i]))
    }
  } else if (props.section === 'vacation') {
    rows = [
      createData('Annual Vacation', props.data.annualVacation),
      createData('Annual Vacation Taken', props.data.annualVacationTaken),
      createData('Sick Days', props.data.sickDays),
      createData('Vaccation', props.data.vacationType
),
    ];
  }


  const { classes } = props;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell className={classes.paddingRight0} align="left" component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.value}</TableCell>
              {row.file &&
                <>
                  <Button onClick={() => {
                    console.log(row.file)
                    axios({
                      url: url+ '/api/places/employees/files?path=' + row.file,
                      method: 'GET',
                      responseType: 'blob', // important
                    }).then((response) => {
                      console.log(response.data);
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'file' + '.' + mime.extension(response.data.type));
                      document.body.appendChild(link);
                      link.click();
                    })
                  }} variant="contained" color="primary">
                    Download
                  </Button>
                </>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
