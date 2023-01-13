import React, {useState} from 'react';
import {Alert, Chip, Divider} from "@mui/material";
import {TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import bindActionCreators from "react-redux/es/utils/bindActionCreators";
import {actionCreators} from "../../../store";
import {useDispatch} from "react-redux";
import json2mq from "json2mq";

function AddVehicle({handleShowAlertAddVehicle}) {
    const user = JSON.parse(localStorage.getItem('user'));
    const apiPath = process.env.REACT_APP_API_PATH;
    const types = {'Tenant': 'Lejer', 'Guest': 'Gæst'};
    const dispatch = useDispatch();
    const {setMyVehicles} = bindActionCreators(actionCreators, dispatch);
    const [typeKey, setTypeKey] = useState(null);
    const [type, setType] = useState('');
    const isMobileTextFields = useMediaQuery(json2mq({
        maxWidth: 1340,
    }));
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [numberPlate, setNumberPlate] = useState(null);
    const [name, setName] = useState(null);

    const handleFromDateChange = (newValue) => {
        setFromDate(dayjs(newValue));
    };

    const handleToDateChange = (newValue) => {
        setToDate(newValue);
    };

    const handleTypeChange = (event) => {
        let key = Object.keys(types).find(key => types[key] === event.target.value);
        setTypeKey(key);
        setType(event.target.value);
    };

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(obj) {
        return obj.getFullYear() + '-' + padTo2Digits(obj.getMonth() + 1) + '-' + padTo2Digits(obj.getDate()) + ' ' + padTo2Digits(obj.getHours()) + ':' + padTo2Digits(obj.getMinutes()) + ':' + padTo2Digits(obj.getSeconds());
    }

    function addNewVehicle() {
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

        fetch(apiPath + 'vehicles', {
            method: "POST",
            body: JSON.stringify(type === 'tenant' ? bodyTenant : bodyGuest),
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
                handleShowAlertAddVehicle(null);
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

            handleShowAlertAddVehicle(tempListOfErrors);
        });
    }

    return (
        <div style={{minHeight: '320px', maxHeight: '320px'}}>
            <Divider>
                <Chip sx={{backgroundColor: '#1A76D2', color: 'white'}} label="Oplysninger"/>
            </Divider>
            <div style={{display: isMobileTextFields ? 'block' : 'flex', marginTop: '10px', justifyContent: 'center'}}>
                <TextField
                    sx={{
                        marginRight: '10px',
                        minWidth: isMobileTextFields ? '100%' : '150px',
                        marginTop: isMobileTextFields ? '10px' : ''
                    }}
                    id="outlined-name"
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                    label="Navn"
                />
                <TextField
                    sx={{
                        marginRight: '10px',
                        minWidth: isMobileTextFields ? '100%' : '150px',
                        marginTop: isMobileTextFields ? '10px' : ''
                    }}
                    id="outlined-numerplate"
                    onChange={(event) => {
                        setNumberPlate(event.target.value);
                    }}
                    label="Nummerplade"
                />
                <TextField
                    sx={{
                        marginRight: '10px',
                        minWidth: isMobileTextFields ? '100%' : '150px',
                        marginTop: isMobileTextFields ? '10px' : ''
                    }}
                    id="outlined-type"
                    select
                    value={type}
                    onChange={handleTypeChange}
                    label="Type"
                >
                    {Object.keys(types).map((type) => (
                        <MenuItem key={type} value={types[type]}>
                            {types[type]}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    sx={{minWidth: isMobileTextFields ? '100%' : '150px', marginTop: isMobileTextFields ? '10px' : ''}}
                    disabled
                    id="outlined-location"
                    label="Lokation"
                    defaultValue={user.location}
                />
            </div>

            {typeKey && typeKey === 'Guest' &&
            <div>
                <Divider sx={{marginTop: '10px'}}>
                    <Chip sx={{backgroundColor: '#1A76D2', color: 'white'}} label="Dato"/>
                </Divider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div style={{display: 'flex', marginTop: '10px', justifyContent: 'center'}}>
                        <DateTimePicker
                            disablePast
                            ampm={false}
                            label="Fra"
                            value={fromDate}
                            onChange={handleFromDateChange}
                            renderInput={(params) => <TextField {...params} sx={{marginRight: '15px'}}/>}
                        />
                        <DateTimePicker
                            disablePast
                            ampm={false}
                            label="Til"
                            value={toDate}
                            onChange={handleToDateChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </div>
                </LocalizationProvider>
            </div>}
            <Button sx={{float: 'right', marginBottom: '10px', marginTop: '15px'}} variant="contained" color="success"
                    onClick={addNewVehicle}
                    endIcon={<AddIcon/>}>
                Tilføj
            </Button>
        </div>
    );
}

export default AddVehicle;