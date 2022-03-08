import React, { useState } from 'react';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';

import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TemporaryDrawer from '../../../shared/components/Navigation/TemporaryDrawer';
import { useAuth } from '../../hooks/auth-hook';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 100,
  },
}));
const MainNavigation = props => {
  const { token, login, logout, userId, position } = useAuth();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };


  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
    {
      id: "population",
      label: "Population",
      minWidth: 170,
      align: "right",
      format: (value) => value.toLocaleString("en-US")
    },
    {
      id: "size",
      label: "Size\u00a0(km\u00b2)",
      minWidth: 170,
      align: "right",
      format: (value) => value.toLocaleString("en-US")
    },
    {
      id: "density",
      label: "Density",
      minWidth: 170,
      align: "right",
      format: (value) => value.toFixed(2)
    }
  ];

  function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
  }

  const classes = useStyles();
  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Z-Reporting
            </Typography>
            {
              <>
                <NavLinks />
              </>
            }
          </Toolbar>
        </AppBar>
      </div>
    </React.Fragment>
  );
};

export default MainNavigation;
