import React from 'react';
import Box from "@mui/material/Box";
import {Button, Grid, TableCell, tableCellClasses} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import DeleteIcon from "@mui/icons-material/Delete";
import {useDispatch} from "react-redux";
import bindActionCreators from "react-redux/es/utils/bindActionCreators";
import {actionCreators} from "../../store";
import LocationsDialog from "./LocationsDialog";
import {styled} from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#1A76D2',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function LocationsTable({locationsRows, handleShowAlert}) {
    const apiPath = process.env.REACT_APP_API_PATH;
    const dispatch = useDispatch();
    const {setLocations} = bindActionCreators(actionCreators, dispatch);

    function deleteLocation(id, address) {
        fetch(apiPath + 'locations/' + id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Accept": "application/json",
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(json => {
                setLocations(json['data']);
                handleShowAlert(`Lokationen med adressen ${address} blev slettet`);
            }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Adresse</StyledTableCell>
                                    <StyledTableCell align="right">By</StyledTableCell>
                                    <StyledTableCell align="right">Postnummer</StyledTableCell>
                                    <StyledTableCell align="right">Antal parkeringspladser</StyledTableCell>
                                    <StyledTableCell align="right"></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {locationsRows && <TableBody>
                                {locationsRows.map((location) => (
                                    <StyledTableRow
                                        key={location.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <StyledTableCell component="th" scope="row">
                                            {location.address}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{location.zipCity.city}</StyledTableCell>
                                        <StyledTableCell align="right">{location.zipCity.zip}</StyledTableCell>
                                        <StyledTableCell align="right">{location.numbOfParkingSpaces}</StyledTableCell>
                                        <StyledTableCell align="right" style={{display: 'flex'}}>
                                            <div style={{display: 'flex'}}>
                                                <LocationsDialog action="update" location={location}
                                                                 handleShowAlert={handleShowAlert}/>
                                                <Button variant="contained" color="error"
                                                        endIcon={<DeleteIcon/>} onClick={() => {
                                                    deleteLocation(location.id, location.address)
                                                }}>
                                                    Slet
                                                </Button>
                                            </div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>}
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LocationsTable;