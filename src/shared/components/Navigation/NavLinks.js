import React, { useContext, useState } from 'react';
import { NavLink, Route, useHistory } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Redirect, } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import IconButton from '@material-ui/core/IconButton'
import PeopleIcon from '@mui/icons-material/People';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import './NavLinks.css';

const NavButtonsStyle = { padding: '0.5rem' };


const NavLinks = props => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const isDrawer = props.isDrawer;

  return (
    !isDrawer ?
      <List className={props.className}>
        {auth.isLoggedIn && (

          <>
            {(auth.position == "HR" ||
              auth.position == "Manager" ||
              auth.position == "Division Manager" ||
              auth.position == "Department Manager" ||
              auth.position == "Section Manager" ||
              auth.position == "Team Leader"
            ) &&
              <>
                <Tooltip title="Requests" placement="bottom" >

                  <ListItem>
                    <IconButton onClick={() => history.push(`/requests`)} style={NavButtonsStyle}>
                      <FileCopyIcon />
                    </IconButton>
                  </ListItem>
                </Tooltip>

                <Tooltip title="All Employees" placement="bottom">

                  <ListItem>
                    <IconButton onClick={() => history.push(`/home`)} style={NavButtonsStyle}>
                      <PeopleIcon />
                    </IconButton>

                  </ListItem>
                </Tooltip>
              </>
            }
            {
              auth.position == "HR" &&
              <>
                <Tooltip title="New Employee" placement="bottom">
                  <ListItem>
                    <IconButton onClick={() => history.push(`/new-employee`)} style={NavButtonsStyle}>
                      <PersonAddIcon />
                    </IconButton>
                  </ListItem>
                </Tooltip>
              </>
            }
            <Tooltip title="Logout" placement="bottom">
              <ListItem>
                <IconButton onClick={auth.logout} style={NavButtonsStyle}>
                  <ExitToAppIcon />
                </IconButton>
              </ListItem>
            </Tooltip>
          </>
        )}
      </List>
      : <List className={props.className}>
        {auth.isLoggedIn && (
          <>
            {(auth.position == "HR" ||
              auth.position == "Manager" ||
              auth.position == "Division Manager" ||
              auth.position == "Department Manager" ||
              auth.position == "Section Manager" ||
              auth.position == "Team Leader"
            ) &&
              <>
                <Tooltip title="Requests" placement="right">
                  <ListItem button onClick={() => history.push(`/requests`)}>
                    <ListItemIcon>
                      <FileCopyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Requests" />
                  </ListItem>
                </Tooltip>
                <Tooltip title="All Employees" placement="right">
                  <ListItem button onClick={() => history.push(`/home`)}>
                    <ListItemIcon >
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Employees" />
                  </ListItem>
                </Tooltip>

              </>
            }

            {
              auth.position == "HR" &&
              <>
                <Tooltip title="New Employee" placement="right">
                  <ListItem button onClick={() => history.push(`/new-employee`)}>
                    <ListItemIcon>
                      <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="New Employee" />
                  </ListItem>
                </Tooltip>
              </>
            }

            <Tooltip title="Logout" placement="right">
              <ListItem button onClick={() => auth.logout()}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />

              </ListItem>
            </Tooltip>
          </>
        )}
      </List>
  );
};

export default NavLinks;
