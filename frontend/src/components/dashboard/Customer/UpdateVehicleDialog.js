import React, {useState} from 'react';
import {
    Alert,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import {useDispatch} from "react-redux";
import bindActionCreators from "react-redux/es/utils/bindActionCreators";
import {actionCreators} from "../../../store";
import EditIcon from "@mui/icons-material/Edit";
import {InputLabel, Select} from "@material-ui/core";
import MenuItem from "@mui/material/MenuItem";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

function UpdateVehicleDialog({vehicle, handleShowAlert}) {
    const types = {'Tenant': 'Lejer', 'Guest': 'Gæst'};
    const apiPath = process.env.REACT_APP_API_PATH;
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const {setMyVehicles} = bindActionCreators(actionCreators, dispatch);
    const [type, setType] = useState(types[vehicle.type]);
    const [typeKey, setTypeKey] = useState(null);
    const [name, setName] = useState(vehicle.name);
    const [numberPlate, setNumberPlate] = useState(vehicle.numberPlate);
    const [fromDate, setFromDate] = useState(dayjs(vehicle.fromDate));
    const [toDate, setToDate] = useState(dayjs(vehicle.toDate));
    const [showAlert, setShowAlert] = useState(null);

    const handleFromDateChange = (newValue) => {
        setFromDate(dayjs(newValue));
    };

    const handleToDateChange = (newValue) => {
        setToDate(newValue);
    };

    const handleClose = () => {
        setShowAlert(null);
        setFromDate(dayjs(vehicle.fromDate));
        setToDate(dayjs(vehicle.toDate));
        setType(types[vehicle.type]);
        setName(vehicle.name);
        setName(vehicle.numberPlate);
        setOpen(false);
    };

    function handleCloseOnUpdate() {
        setShowAlert(null);
        setOpen(false);
    }

    const handleClickOpen = () => {
        let key = Object.keys(types).find(key => types[key] === type);
        setTypeKey(key);
        setOpen(true);
    };

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(obj) {
        return obj.getFullYear() + '-' + padTo2Digits(obj.getMonth() + 1) + '-' + padTo2Digits(obj.getDate()) + ' ' + padTo2Digits(obj.getHours()) + ':' + padTo2Digits(obj.getMinutes()) + ':' + padTo2Digits(obj.getSeconds());
    }

    function updateVehicle(event) {
        event.preventDefault();
        let fromDateStr = formatDate(fromDate.toDate());
        let toDateStr = formatDate(toDate.toDate());

        let bodyTenant = {
            numberPlate: numberPlate,
            type: typeKey,
            name: name
        }

        let bodyGuest = {
            numberPlate: numberPlate,
            type: typeKey,
            name: name,
            fromDate: fromDateStr,
            toDate: toDateStr
        }

        fetch(apiPath + 'vehicles/' + vehicle.id, {
            method: "POST",
            body: JSON.stringify(typeKey === 'Tenant' ? bodyTenant : bodyGuest),
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
                handleShowAlert(`Bilen med nummerpladen ${numberPlate} er opdateret`);
                handleCloseOnUpdate();
            }).catch((error) => {
            let errObj = {
                type: {label: 'Type', variableRef: type},
                numberPlate: {label: 'Nummerplade', variableRef: numberPlate},
                name: {label: 'Navn', variableRef: name},
            };

            let tempListOfErrors = [];
            Object.keys(errObj).forEach((key) => {
                if (!errObj[key]['variableRef']) {
                    tempListOfErrors.push(errObj[key]['label']);
                }
            });

            setShowAlert(tempListOfErrors);
        });
    }

    const handleTypeChange = (event) => {
        let key = Object.keys(types).find(key => types[key] === event.target.value);
        setTypeKey(key);
        setType(event.target.value);
    };

    return (
        <div>
            <IconButton edge="end" aria-label="delete" onClick={handleClickOpen}
                        sx={{marginRight: '1px', color: '#1A76D2'}}>
                <EditIcon/>
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <Box component="form" onSubmit={updateVehicle}>
                    <DialogTitle>Opdater køretøj
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
                    </DialogTitle>
                    <DialogContent>

                        {showAlert &&
                        <Alert severity="error" sx={{marginBottom: '5px', width: '90%'}}>Følgende oplysninger
                            mangler at blive udfyldt:
                            {showAlert.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </Alert>}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Avatar sx={{width: 100, height: 100, backgroundColor: '#1A76D2'}}>
                                <DirectionsCarIcon sx={{width: 75, height: 75}}/>
                            </Avatar>
                        </div>
                        <TextField
                            autoFocus
                            defaultValue={vehicle.name}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                            margin="dense"
                            id="name-update"
                            name="name-update"
                            label="Navn"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            defaultValue={vehicle.numberPlate}
                            onChange={(event) => {
                                setNumberPlate(event.target.value);
                            }}
                            margin="dense"
                            id="numberPlate-update"
                            name="numberPlate-update"
                            label="Nummerplade"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <InputLabel style={{fontSize: '13px'}}>Type</InputLabel>
                        <Select
                            labelId="select-type-update"
                            id="select-type-update"
                            fullWidth
                            value={type}
                            onChange={handleTypeChange}
                            label="type-update"
                        >
                            {Object.keys(types).map((type) => (
                                <MenuItem key={type} value={types[type]}>
                                    {types[type]}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            disabled
                            defaultValue={vehicle.location.address}
                            margin="dense"
                            id="location-update"
                            name="location-update"
                            label="Lokation"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        {typeKey && typeKey === 'Guest' &&
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div>
                                    <DateTimePicker
                                        disablePast
                                        ampm={false}
                                        label="Fra"
                                        value={fromDate}
                                        onChange={handleFromDateChange}
                                        renderInput={(params) => <TextField fullWidth{...params}
                                                                            sx={{marginTop: '15px'}}/>}
                                    />
                                </div>
                                <div>
                                    <DateTimePicker
                                        disablePast
                                        ampm={false}
                                        label="Til"
                                        value={toDate}
                                        onChange={handleToDateChange}
                                        renderInput={(params) => <TextField fullWidth{...params}
                                                                            sx={{marginTop: '15px'}}/>}
                                    />
                                </div>
                            </LocalizationProvider>
                        </div>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Opdater</Button>
                        <Button onClick={handleClose}>Annuller</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
}

export default UpdateVehicleDialog;