import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useEffect, useState} from "react";
import {Autocomplete, tableCellClasses} from "@mui/material";
import {TextField} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import bindActionCreators from "react-redux/es/utils/bindActionCreators";
import {actionCreators} from "../../../store";
import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";
import {fetchLocations} from "../../../services/Data";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import json2mq from "json2mq";

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#1A76D2',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

function Row(props) {
    const {row} = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}, backgroundColor: props.backgroundColor}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.numberPlate}
                </TableCell>
                <TableCell align="right">{row.location}</TableCell>
                <TableCell align="right">{row.entryDate}</TableCell>
                <TableCell align="right"> <Button size="small" style={{borderRadius: '15px', fontSize: "10px"}}
                                                  variant="contained"
                                                  color={row.status === 'Invalid' ? 'error' : 'success'}>
                    {row.status === 'Invalid' ? 'Ugyldig' : 'Gyldig'}
                </Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography sx={{fontSize: 16}} color="text.secondary" gutterBottom>
                                Billede af nummerplade
                            </Typography>
                            <div>
                                <img alt="Billede af nummerplade"
                                     style={{display: 'block', marginRight: 'auto', marginLeft: 'auto'}}
                                     src={row.imagePath} width="200" height="200"/>
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function AdminTableOverview() {
    const isMobile = useMediaQuery(json2mq({
        maxWidth: 615,
    }));
    const [rows, setRows] = useState([]);
    const [numberPlates, setNumberPlates] = useState([]);
    const imagePath = process.env.REACT_APP_IMAGES_PATH;
    const apiPath = process.env.REACT_APP_API_PATH;
    const state = useSelector((state) => state);
    const entries = state.entries;
    const location = state.location;
    const dispatch = useDispatch();
    const {setEntries, setLocation} = bindActionCreators(actionCreators, dispatch);
    const [locations, setLocations] = useState(null);
    let user = null;

    if (localStorage.getItem('user')) {
        user = JSON.parse(localStorage.getItem('user'))
    }

    fetchLocations().then(response => {
        if (locations === null) {
            setLocations(response);
        }
    });

    useEffect(() => {
        if (entries === null) {
            fetch(apiPath + 'entry', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Accept": "application/json",
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
                .then(json => {
                    const tempRows = [];
                    json['data'].forEach((item) => {
                        item.imagePath = imagePath + item.imagePath;

                        let obj = {
                            numberPlate: item.numberPlate,
                            location: item.location[0].address,
                            entryDate: item.entryDate,
                            imagePath: item.imagePath,
                            status: item.status
                        }
                        tempRows.push(obj);
                    });
                    sortEntries(tempRows);
                    setEntries(tempRows);
                    setRows(tempRows);
                    getNumberPlates(tempRows);
                }).catch((error) => {
                console.log(error)
            });
        } else {
            setRows(entries);
            getNumberPlates(entries);
        }
        showByLocation();
    }, [location, entries]);

    function sortEntries(entries) {
        entries.sort(function (entry1, entry2) {
            return new Date(entry2.entryDate) - new Date(entry1.entryDate);
        });
    }

    function showByLocation() {
        if (location != null && entries) {
            let tempRows = entries.filter((item) => {
                return item.location === location;
            });
            setRows(tempRows);
        }
    }

    function getNumberPlates(entries) {
        let tempNumberPlates = entries.map((item) => {
            return item.numberPlate;
        });
        setNumberPlates(tempNumberPlates);
    }


    function updateTableOverview(newValue) {
        if (newValue != null) {
            const tempRows = entries.filter((item) => {
                return item.numberPlate === newValue;
            })
            setRows(tempRows);
        } else {
            setRows(entries);
        }
    }

    return (
        <div>
            <div style={{display: isMobile ? 'block' : 'flex'}}>
                <Typography sx={{fontSize: 16}} color="text.secondary" gutterBottom m={2.5}>
                    Parkeringer
                </Typography>
                {locations && user.role === 'Admin' &&
                <div style={{marginBottom: isMobile ? '5px' : '0', display: 'flex', marginLeft: 'auto'}}>
                    <Autocomplete
                        style={{marginRight: '10px'}}
                        disablePortal
                        id="combo-box"
                        noOptionsText={'Ingen lokationer'}
                        options={locations.map((item) => {
                            return item.address;
                        })}
                        sx={{width: 200}}
                        onChange={(event, newValue) => {
                            setLocation(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Lokation"/>}
                    />
                    <Autocomplete
                        // disablePortal
                        id="combo-box"
                        noOptionsText={'Ingen nummerplader'}
                        options={numberPlates}
                        sx={{width: 200}}
                        onChange={(event, newValue) => {
                            updateTableOverview(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Nummerplade"/>}
                    />
                </div>}
            </div>
            <TableContainer component={Paper} style={{maxHeight: 550}}>
                <Table aria-label="collapsible table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell/>
                            <StyledTableCell>Nummerplade</StyledTableCell>
                            <StyledTableCell align="right">Lokation</StyledTableCell>
                            <StyledTableCell align="right">Tidspunkt for indkørsel</StyledTableCell>
                            <StyledTableCell align="right">Gyldig parkering</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {rows && <TableBody style={{overflow: 'auto'}}>
                        {rows.map((row, index) => (
                            <Row key={row.numberPlate} row={row}
                                 backgroundColor={index % 2 === 0 ? '#F5F5F5' : 'white'}/>
                        ))}
                    </TableBody>}
                </Table>
            </TableContainer>
        </div>
    );
}

export default AdminTableOverview;