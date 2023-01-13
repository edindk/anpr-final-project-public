import React, {useEffect, useState} from 'react';
import {Alert, Avatar, Card, List, ListItem, ListItemAvatar, ListItemText, Pagination} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import {useDispatch, useSelector} from "react-redux";
import bindActionCreators from "react-redux/es/utils/bindActionCreators";
import {actionCreators} from "../../../store";
import Typography from "@mui/material/Typography";
import {isArray} from "leaflet/src/core/Util";
import UpdateVehicleDialog from "./UpdateVehicleDialog";
import Pusher from 'pusher-js';
import {getMyVehicles} from "../../../services/Data";

var pusher = new Pusher('14...', {
    cluster: 'eu'
});

var channel = pusher.subscribe('myvehicles-channel');

function MyVehicles(props) {
    const apiPath = process.env.REACT_APP_API_PATH;
    const [myVehiclesInChunks, setMyVehiclesInChunks] = useState(null);
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const {setMyVehicles} = bindActionCreators(actionCreators, dispatch);
    const myVehicles = state.myVehicles;
    const [myVehiclesLocally, setMyVehiclesLocally] = useState(null);
    const types = {'Tenant': 'Lejer', 'Guest': 'Gæst'}
    const [showAlert, setShowAlert] = useState(null);

    if (myVehicles === null) {
        getMyVehicles().then(tempMyVehicles => {
            setMyVehicles(tempMyVehicles);
        });
    }

    channel.bind('myvehicles-event', function () {
        getMyVehicles().then(tempMyVehicles => {
            setMyVehicles(tempMyVehicles);
        });
    }, channel.unbind());

    useEffect(() => {
        if (myVehicles && isArray(myVehicles)) {
            setMyVehiclesLocally(myVehicles.slice(0, 2))
            setMyVehiclesInChunks(divideMyVehiclesIntoChunks(myVehicles));
        }
    }, [myVehicles]);

    function divideMyVehiclesIntoChunks(tempMyVehicles) {
        let amountOfElements = 2;
        let tempArr = [];
        let key = 1;
        let tempMyVehiclesChunks = {};

        tempMyVehicles.forEach((vehicle, index) => {
            if (amountOfElements > 0) {
                tempArr.push(vehicle);
                amountOfElements -= 1
                tempMyVehiclesChunks[key] = tempArr;
            }

            if (amountOfElements === 0) {
                key += 1;
                amountOfElements = 2;
                tempArr = [];
            }
        });

        return tempMyVehiclesChunks;
    }

    function handlePagination(key) {
        setMyVehiclesLocally(myVehiclesInChunks[key]);
    }

    function handleDelete(id, numberPlate) {
        fetch(apiPath + 'vehicles/' + id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Accept": "application/json",
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(json => {
                let tempMyVehicles = [];
                json.forEach((vehicle) => {
                    if (vehicle.toDate !== 'Infinite') {
                        let today = new Date();
                        let dateToCheck = new Date(vehicle.toDate);
                        let dateInThePast = dateToCheck < today;

                        vehicle.status = dateInThePast ? `Ugyldig (${vehicle.toDate})` : `Gyldig til ${vehicle.toDate}`;
                    } else {
                        vehicle.status = 'Gyldig';
                    }

                    tempMyVehicles.push(vehicle);
                });

                setMyVehicles(tempMyVehicles);
                handleShowAlert(`Bilen med nummerpladen ${numberPlate} er slettet`)
            }).catch((error) => {
            console.log(error);
        });
    }

    function handleShowAlert(msg) {
        setShowAlert(msg);
        setTimeout(() => {
            setShowAlert(null);
        }, 5000)
    }

    return (
        <div>
            {showAlert && <Alert severity="success" sx={{marginBottom: '5px', width: '96.5%'}}>{showAlert}</Alert>}
            {myVehiclesLocally &&
            <List style={{minHeight: '320px', maxHeight: '280px'}}>
                {myVehiclesLocally.map((vehicle) => (
                    <Card sx={{marginTop: '15px'}} key={vehicle.id}>
                        <ListItem
                            secondaryAction={
                                <div style={{display: 'flex'}}>
                                    <UpdateVehicleDialog vehicle={vehicle} handleShowAlert={handleShowAlert}/>
                                    <IconButton edge="end" aria-label="delete" sx={{color: 'red'}} onClick={() => {
                                        handleDelete(vehicle.id, vehicle.numberPlate)
                                    }}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{width: 50, height: 50, backgroundColor: '#1A76D2'}}>
                                    <DirectionsCarIcon sx={{width: 35, height: 35}}/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                disableTypography
                                primary={<Typography variant="body1">{vehicle.name}</Typography>}
                                secondary={<div>
                                    <Typography variant="body2">{`Nummerplade: ${vehicle.numberPlate}`}</Typography>
                                    <Typography variant="body2">{`Type: ${types[vehicle.type]}`}</Typography>
                                    <Typography variant="body2">Status: {vehicle.status}</Typography>
                                    <Typography
                                        variant="body2">{`Lokation: ${vehicle.location.address}, ${vehicle.location.zip_city.zip}, ${vehicle.location.zip_city.city}`}</Typography>
                                </div>}
                            />
                        </ListItem>
                    </Card>
                ))}
                <Pagination style={{display: 'flex', justifyContent: 'center', marginTop: '15px'}} showFirstButton
                            showLastButton hidePrevButton hideNextButton
                            count={Object.keys(myVehiclesInChunks).length}
                            onChange={(event) => {
                                let elem = event.currentTarget;
                                let label = elem.getAttribute('aria-label');
                                if (label === 'Go to first page' || 'Go to last page') {
                                    switch (label) {
                                        case 'Go to first page':
                                            setMyVehiclesLocally(myVehiclesInChunks[1]);
                                            break;
                                        case 'Go to last page':
                                            let arrOfKeys = Object.keys(myVehiclesInChunks);
                                            setMyVehiclesLocally(myVehiclesInChunks[arrOfKeys[arrOfKeys.length - 1]]);
                                            break;
                                        default:
                                            break;
                                    }

                                }

                                if (event.currentTarget.textContent !== '') {
                                    handlePagination(event.currentTarget.textContent);
                                }
                            }}/>
            </List>
            }
        </div>
    );
}

export default MyVehicles;