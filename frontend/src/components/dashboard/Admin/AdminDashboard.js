import React, {useState} from 'react';
import * as PropTypes from "prop-types";
import {Alert, Card, CardContent, Grid} from "@mui/material";
import Box from "@mui/material/Box";
import AdminTableOverview from "./AdminTableOverview";
import AdminMap from "./AdminMap";
import Cards from "./Cards";
import {Snackbar} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

function Item(props) {
    return null;
}

Item.propTypes = {children: PropTypes.node};

function AdminDashboard(props) {
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        message: null,
    });
    const {vertical, horizontal, open, message} = state;

    const handleClose = () => {
        setState({...state, open: false});
    };

    document.addEventListener('showSnackbar', function (e) {
        let message = `Køretøj med nummerpladen: ${e.detail.vehicle['numberPlate']} er kørt ind på ${e.detail.vehicle['location']}.`;

        setState({...state, message: message, open: true});
    }, false);

    return (
        <Box sx={{flexGrow: 1}}>
            <Snackbar
                anchorOrigin={{vertical, horizontal}}
                open={open}
                onClose={handleClose}
                key={vertical + horizontal}
                action={
                    <React.Fragment>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            sx={{p: 0.5}}
                            onClick={handleClose}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </React.Fragment>
                }>
                {message && <Alert onClose={handleClose} severity="info" sx={{width: '100%'}}>
                    {message}
                </Alert>}
            </Snackbar>
            <Cards/>
            <Grid container spacing={2}>
                <Grid item lg={7} md={12} sm={12} xs={12}>
                    <Card style={{minHeight: '640px', maxHeight: '640px'}}>
                        <CardContent>
                            <AdminTableOverview/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={5} md={12} sm={12} xs={12}>
                    <Card style={{minHeight: '600px'}}>
                        <CardContent>
                            <AdminMap/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AdminDashboard;