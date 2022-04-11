// import React, { useState, useEffect } from 'react';
import { Typography as Typo, Button } from '@supabase/ui';






import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';

import HomeScreen from '../Pages/HomeScreen'
import ZReport from '../Pages/ZReport';

import {
  Switch,
  Route,
  Link,
  useLocation,
  Redirect
} from "react-router-dom";

import {selectedDateState, zheaderIdState} from '../states'
import {routes} from '../routs';

const drawerWidth = 240;

const ProfileMenu = (props) =>{
    const user = props.supabaseClient.auth.user()
    return (
      <Box sx={{padding: 5}}>
        <Typo.Text>{user.email}</Typo.Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </Box>
    )
}

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  // backgroundColor: 'rgba(36,180,126)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


const App = (props) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const selectedDate = selectedDateState.useState(s=>s);
  const zheaderId = zheaderIdState.useState(s=>s);
  let location = useLocation();
  
  const handleProfileMenu = ()=>{
    setProfileMenuOpen(!profileMenuOpen);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between'}}>
            <Typography variant="h6" noWrap component="div">
              Z-Report
            </Typography>
            <Box sx={{cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>
              <Tooltip title="Profile">
                <IconButton onClick= {handleProfileMenu}>
                  <Avatar />
                </IconButton>
              </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  // anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={profileMenuOpen}
                  onClose={handleProfileMenu}
                >
                    <ProfileMenu supabaseClient={props.supabaseClient}/>
                </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {routes.map((route, index) => (
            <ListItemButton
              selected ={route.path === location.pathname}
              key={index}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              component={Link}
              to={route.path}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {route.icon ?? <MailIcon/>}
              </ListItemIcon>
              <ListItemText primary={route.text ?? `route ${index}`} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          ))}
        </List>
        
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
          <Switch>
            <Route exact path="/">
              <HomeScreen />
            </Route>
            <Route path="/ZReport">
              {(!selectedDate && !zheaderId) ? <Redirect to="/" /> : <ZReport /> }
            </Route>
          </Switch>
        {/* {(!selectedDate && !zheaderId) && <HomeScreen />}
        {(selectedDate && zheaderId) && <ZReport />} */}
      </Box>
    </Box>
  );
}

export default App;