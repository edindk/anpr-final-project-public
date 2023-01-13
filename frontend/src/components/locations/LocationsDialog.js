import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as L from "leaflet";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import {useDispatch} from "react-redux";
import bindActionCreators from "react-redux/es/utils/bindActionCreators";
import {actionCreators} from "../../store";
import CreateIcon from "@mui/icons-material/Create";
import MapIcon from '@mui/icons-material/Map';

function LocationsDialog({action, location, handleShowAlert}) {
    const apiPath = process.env.REACT_APP_API_PATH;
    const [open, setOpen] = useState(false);
    const [map, setMap] = useState(null);
    const [mapElem, setMapElem] = useState(null);
    const [latLng, setLatLng] = useState(location != null ? {lat: location.lat, lng: location.lng} : {
        lat: 56.26392,
        lng: 11.5
    });
    const dispatch = useDispatch();
    const {setLocations} = bindActionCreators(actionCreators, dispatch);
    const [nominatimLatLng, setNominatimLatLng] = useState({
        lat: 56.26392,
        lng: 11.5
    });
    const [nominatimParams, setNominatimParams] = useState({
        street: '',
        postalcode: '',
        city: ''
    });
    const [listOfErrors, setListOfErrors] = useState([]);

    useEffect(() => {
        let icon = L.icon({
            iconUrl: require('../../assets/images/icons8-parking.png'),
            iconSize: [30, 30], // size of the icon
            popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
        });

        if (mapElem) {
            if (map !== null) {
                map.off();
                map.remove();
            }
            let tempMap = L.map('map').setView([56.26392, 11.5], 6);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(tempMap);
            let marker = L.marker(location != null ? [parseFloat(location.lat), parseFloat(location.lng)] : [56.26392, 11.5], {
                draggable: true,
                name: 'marker',
                icon: icon
            }).addTo(tempMap).on('dragend', () => {
                setLatLng(marker.getLatLng());
            });

            L.Control.ResetControl = L.Control.extend({
                onAdd: function (map) {
                    var el = L.DomUtil.create('button', 'control-reset');
                    el.type = 'button';
                    L.DomEvent.addListener(el, 'click', () => {
                        var newLatLng = new L.LatLng(56.26392, 11.5);
                        marker.setLatLng(newLatLng);
                        tempMap.setView([56.26392, 11.5], 6);
                    });
                    el.innerHTML = 'Nulstil';

                    return el;
                },
            });

            L.control.resetControl = function (opts) {
                return new L.Control.ResetControl(opts);
            }

            L.control.resetControl({
                position: 'topright'
            }).addTo(tempMap);
            setMap(tempMap);
        }
    }, [mapElem])

    const handleClickOpen = () => {
        setOpen(true);
        setTimeout(() => {
            setMapElem(window.document.getElementById('map'));
        }, 0)
    };
    const handleClose = () => {
        setOpen(false);
    };

    const createLocation = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        fetch(apiPath + 'locations', {
            method: "POST",
            body: JSON.stringify({
                address: data.get('address'),
                city: data.get('city'),
                zip: data.get('zip'),
                latLng: latLng,
                numbOfParkingSpaces: data.get('numbOfParkingSpaces')
            }),
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Accept": "application/json",
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(json => {
                setLocations(json['data']);
                handleClose();
                handleShowAlert('Ny lokation blev tilføjet');
            }).catch((error) => {
            let errObj = {
                address: 'Adresse',
                city: 'By',
                zip: 'Postnummer',
                numbOfParkingSpaces: 'Antal parkeringspladser'
            };

            let tempListOfErrors = [];
            Object.keys(errObj).forEach((key) => {

                if (data.get(key) === '') {
                    tempListOfErrors.push(errObj[key]);
                }
            });
            if (latLng.lat === 56.26392 && latLng.lng === 11.5) {
                tempListOfErrors.push('Placering af lokation på kortet');
            }
            setListOfErrors(tempListOfErrors);
        });
    }

    function updateLocation(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        fetch(apiPath + 'locations/' + location.id, {
            method: "POST",
            body: JSON.stringify({
                address: data.get('address'),
                city: data.get('city'),
                zip: data.get('zip'),
                latLng: latLng,
                numbOfParkingSpaces: data.get('numbOfParkingSpaces')
            }),
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Accept": "application/json",
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(json => {
                setLocations(json['data']);
                handleClose();
                handleShowAlert(`Lokationen med adressen ${data.get('address')} blev opdateret`);
            }).catch((error) => {
            let errObj = {
                address: 'Adresse',
                city: 'By',
                zip: 'Postnummer',
                numbOfParkingSpaces: 'Antal parkeringspladser'
            };

            let tempListOfErrors = [];
            Object.keys(errObj).forEach((key) => {

                if (data.get(key) === '') {
                    tempListOfErrors.push(errObj[key]);
                }
            });
            setListOfErrors(tempListOfErrors);
        });
    }

    function defaultLatLngOnCreate() {
        let path = `https://nominatim.openstreetmap.org/search?postalcode${nominatimParams['postalcode']}=&city=${nominatimParams['city']}&street=${nominatimParams['street']}&country=Denmark&format=json`;
        let lat = null;
        let lng = null;


        fetch(path)
            .then(response => response.json())
            .then(json => {
                lat = json[0].lat
                lng = json[0].lon
            }).then(() => {
            console.log({lat: lat, lng: lng})

            if (map && action === 'create') {
                let tempMap = map;
                tempMap.eachLayer(function (layer) {
                    if (layer.options.name === 'marker') {
                        layer.setLatLng([lat, lng])
                    }
                });
                setMap(tempMap);
                setLatLng({lat: lat, lng: lng})
            }
        })
    }

    function updateNominatimPath({target}) {
        setNominatimParams({...nominatimParams, [target.id]: target.value});
    }

    return (
        <div>
            {action === 'create' ? <Button variant="contained" color="success" onClick={handleClickOpen}
                                           style={{marginBottom: '17px', height: '55px'}} endIcon={<AddIcon/>}>Tilføj
                    lokation</Button> :
                <Button variant="contained" sx={{backgroundColor: '#1A76D2'}} onClick={handleClickOpen}
                        style={{marginRight: '5px'}} endIcon={<CreateIcon sx={{color: 'white'}}/>}>Rediger</Button>}
            <Dialog open={open} onClose={handleClose}>
                <Box component="form" onSubmit={action === 'create' ? createLocation : updateLocation}>
                    <DialogTitle>{action === 'create' ? 'Tilføj ny lokation' : 'Opdater lokation'}
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                        {listOfErrors.length > 0 &&
                        <Alert severity="error">Følgende oplysninger mangler at blive
                            udfyldt: {listOfErrors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </Alert>}
                    </DialogTitle>
                    <div style={{height: '300px'}} id="map"/>
                    <DialogContent>
                        <TextField
                            autoFocus
                            onChange={updateNominatimPath}
                            defaultValue={location != null ? location.address : ''}
                            margin="dense"
                            id="street"
                            name="address"
                            label="Adresse"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            onChange={updateNominatimPath}
                            defaultValue={location != null ? location.zipCity.city : ''}
                            margin="dense"
                            id="city"
                            name="city"
                            label="By"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            onChange={updateNominatimPath}
                            defaultValue={location != null ? location.zipCity.zip : ''}
                            margin="dense"
                            name="zip"
                            id="postalcode"
                            label="Postnummer"
                            type="number"
                            fullWidth
                            variant="standard"
                        />
                        {nominatimParams['street'] !== '' && nominatimParams['city'] !== '' && nominatimParams['postalcode'] !== '' &&
                        <Button variant="contained" sx={{backgroundColor: '#1A76D2'}}
                                onClick={defaultLatLngOnCreate}
                                style={{float: 'right'}}
                                endIcon={<MapIcon sx={{color: 'white'}}/>}>Placer lokation</Button>}
                        <TextField
                            defaultValue={location != null ? location.numbOfParkingSpaces : ''}
                            margin="dense"
                            name="numbOfParkingSpaces"
                            id="numbOfParkingSpaces"
                            label="Antal parkeringspladser"
                            type="number"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">{action === 'create' ? 'Tilføj' : 'Opdater'}</Button>
                        <Button onClick={handleClose}>Annuller</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
}

export default LocationsDialog;