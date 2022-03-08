import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { AuthContext } from '../../context/auth-context';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import HomeIcon from '@mui/icons-material/Home';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NavLinks from './NavLinks';
import Grid from '@material-ui/core/Grid';
import { Hidden } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import './NavLinks.css';




const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        margin: 40,

    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    title: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        // width: theme.spacing(7) + 1,
        width: 0,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function MiniDrawer() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorE2, setAnchorE2] = React.useState(null);
    const [anchorE3, setAnchorE3] = React.useState(null);
    const auth = useContext(AuthContext);
    const history = useHistory();


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMenuClickMain = (event) => {
        history.push('/employee/' + auth.userId);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick1 = (event) => {
        setAnchorE2(event.currentTarget);
    };

const handleMenuClick2 = (event) => {
        setAnchorE3(event.currentTarget);
        history.push('/changePassword')
    };

    const handleMenuSiteClick1 = (event) => {
        setAnchorEl(null);
        history.push('/home?site=beirut');
    };

    const handleMenuSiteClick2 = (event) => {
        setAnchorE2(null);
        history.push('/home?site=kinshasa');
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorE2(null);
        setAnchorE3(null);
        history.push('/requests/day-off');
    };

    const handleClosing = () => {
        setAnchorEl(null);
        setAnchorE2(null);
        setAnchorE3(null);
    };

    const handleClose1 = () => {
        setAnchorE2(null);
        history.push('/requests/adavnce-salary-payment');
    };

    const handleClose2 = () => {
        setAnchorE2(null);
        history.push('/my-requests')
    };

    const handleClose3 = () => {
        setAnchorE3(null);
        history.push('/requests/office-payments');
    };
    const serachFieldChange = (event) => {
        console.log(event.target.value)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Hidden xsDown>
                        <Typography variant="h6" noWrap className={classes.title}>
                            HR-MEC
                        </Typography>
                    </Hidden>
                    {/*   <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={serachFieldChange}
                        />
                        </div>*/}
                    <Hidden smDown>
                        <NavLinks className="nav-links" />
                    </Hidden>

                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <Hidden smUp>
                        <Typography variant="h6" noWrap className={classes.title}>
                            HR-MEC
                        </Typography>
                    </Hidden>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton >
                </div>
                <Divider />
                <List>
                    <Tooltip title="Home" placement="right">
                        <ListItem button aria-controls="simple-menu1" aria-haspopup="true" onClick={handleMenuClickMain} key="request">
                            <ListItemIcon> <HomeIcon /></ListItemIcon>
                            <ListItemText primary="Home Page" />
                        </ListItem>
                    </Tooltip>
                    <Tooltip title="Requests" placement="right">
                        <ListItem button aria-controls="simple-menu1" aria-haspopup="true" onClick={handleMenuClick1} key="request">
                            <ListItemIcon> <BookmarkBorderIcon /></ListItemIcon>
                            <ListItemText primary="Requests" />
                        </ListItem>
                    </Tooltip>
                     <Tooltip title="Change Password" placement="right">
                        <ListItem button aria-controls="simple-menu1" aria-haspopup="true" onClick={handleMenuClick2} key="request">
                            <ListItemIcon> <LockOpenIcon /></ListItemIcon>
                            <ListItemText primary="Change Password" />
                        </ListItem>
                    </Tooltip>
                </List>
                <Divider />
                <Hidden mdUp>
                    <NavLinks isDrawer={true} />
                </Hidden>


                <Menu
                    id="simple-menu1"
                    anchorEl={anchorE2}
                    keepMounted
                    open={Boolean(anchorE2)}
                    onClose={handleClosing}
                >
                    <MenuItem onClick={handleClose2}>My Requests</MenuItem>
                    <MenuItem onClick={handleClose}>Leave</MenuItem>
                    <MenuItem onClick={handleClose1}>Salary Payment</MenuItem>
                    <MenuItem onClick={handleClose3}>Other Payment</MenuItem>
                </Menu>
            </Drawer>

        </div >
    );
}