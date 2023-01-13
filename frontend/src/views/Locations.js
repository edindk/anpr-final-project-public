import React, {useEffect, useState} from 'react';
import {Alert, Autocomplete, Container, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {fetchLocations} from "../services/Data";
import {useDispatch, useSelector} from "react-redux";
import bindActionCreators from "react-redux/es/utils/bindActionCreators";
import {actionCreators} from "../store";
import LocationsTable from "../components/locations/LocationsTable";
import LocationsDialog from "../components/locations/LocationsDialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import json2mq from 'json2mq';

function Locations(props) {
    const [location, setLocation] = useState(null);
    const [locationsRows, setLocationRows] = useState(null);
    const state = useSelector((state) => state);
    const locations = state.locations;
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(null);
    const {setLocations} = bindActionCreators(actionCreators, dispatch);
    const isMobile = useMediaQuery(json2mq({
        maxWidth: 900,
    }));

    fetchLocations().then(response => {
        if (locations === null) {
            setLocations(response);
            setLocationRows(response);
        }
    });

    useEffect(() => {
        setLocationRows(locations);
    }, [locations])

    useEffect(() => {
        if (location) {
            let tempLocations = locations.filter((item) => {
                return item.address === location;
            });
            setLocationRows(tempLocations);
        } else {
            setLocationRows(locations);
        }
    }, [location])

    function handleShowAlert(msg) {
        console.log(msg);
        setShowAlert(msg);
        setTimeout(() => {
            setShowAlert(null);
        }, 5000)
    }

    return (
        <Container maxWidth="xl">
            {showAlert &&
            <Alert sx={{marginBottom: '15px'}} severity="success">{showAlert}</Alert>}
            <div style={{display: isMobile ? 'block' : 'flex'}}>
                <Typography m={2.5}
                            variant="h6"
                            color="textSecondary"
                            component="h2"
                            gutterBottom
                >
                    Lokationer
                </Typography>
                <div style={{display: 'flex', marginLeft: 'auto'}}>
                    <Autocomplete
                        disablePortal
                        id="combo-box"
                        noOptionsText={'Ingen lokationer'}
                        options={locations ? locations.map((item) => {
                            return item.address;
                        }) : []}
                        sx={{width: 250, marginRight: '5px'}}
                        onChange={(event, newValue) => {
                            setLocation(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label="Søg"/>}
                    />
                    <LocationsDialog action="create" handleShowAlert={handleShowAlert}/>
                </div>
            </div>
            {locationsRows && <LocationsTable locationsRows={locationsRows} handleShowAlert={handleShowAlert}/>}
        </Container>

    );
}

export default Locations;