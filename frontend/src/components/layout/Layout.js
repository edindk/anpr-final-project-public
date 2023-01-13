import React from 'react';
import {makeStyles} from '@material-ui/core';
import Nav from "./Nav";
import {useLocation} from "react-router-dom";

const useStyles = makeStyles((theme) => {
    return {
        page: {
            background: '#f9f9f9',
            width: '100%',
            paddingTop: '24px',
            paddingBottom: '24px',
            minHeight: '100vh',
        },
        toolbar: theme.mixins.toolbar
    }
});

function Layout({children}) {
    const classes = useStyles()
    const path = useLocation().pathname;

    return (
        <div>
            <div className={classes.page}>
            {path === '/' || path === '/locations' ? <Nav/> : ''}
                {path !== '/login' ? <div className={classes.toolbar}/> : ''}
                {children}
            </div>
        </div>
    )   ;
}

export default Layout;