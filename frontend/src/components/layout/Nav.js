import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

function Nav() {

    const apiPath = process.env.REACT_APP_API_PATH;
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [path, setPath] = useState(null);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const pagesAdmin = [{title: 'Dashboard', path: '/'}, {title: 'Lokationer', path: '/locations', role: 'Admin'}];
    const pagesCustomer = [{title: 'Dashboard', path: '/'}];
    const pages = user !== null && user !== 'undefined' && 'role' in user && user.role === 'Admin' ? pagesAdmin : pagesCustomer;
    const settings = [{label: 'Log ud', setting: 'Log out'}];

    function logOut() {
        fetch(apiPath + 'logout', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Accept": "application/json",
                'Content-Type': 'application/json'
            }
        }).then(() => {
            localStorage.setItem('token', null);
            localStorage.setItem('user', null);
            navigate('/login')
        });
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    useEffect(() => {
        handleCloseNavMenu();
        if (window.location.pathname !== path) {
            navigate(path);
        }
    }, [path])

    function handleCloseNavMenu() {
        if (anchorElNav !== null) {
            setAnchorElNav(null);
        }
    }

    function handleClickedUserMenuItem(setting) {
        handleCloseUserMenu();
        switch (setting) {
            case 'Log out':
                logOut();
                break;
            default:
                //
                break;
        }
    }

    const handleCloseUserMenu = () => {
        if (anchorElUser !== null) {
            setAnchorElUser(null);
        }
    };

    return (
        <AppBar style={{backgroundColor: '#1A76D2'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href=""
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        SmartPark
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.title} onClick={() => {
                                    setPath(page.path);
                                }}>
                                    <Typography textAlign="center">{page.title}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        SmartPark
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                style={{
                                    marginRight: '3px',
                                    backgroundColor: window.location.pathname === page.path ? '#5E9FDF' : ''
                                }}
                                key={page.title}
                                onClick={() => {
                                    setPath(page.path)
                                }}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Indstillinger">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                {user && <Avatar>{user.name.charAt(0)}</Avatar>}
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.label} onClick={() => {
                                    handleClickedUserMenuItem(setting.setting)
                                }}>
                                    <Typography textAlign="center">{setting.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Nav;