import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {Avatar} from "@material-ui/core";
import CheckIcon from '@mui/icons-material/Check';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import {useSelector} from "react-redux";

function Cards(props) {
    const apiPath = process.env.REACT_APP_API_PATH;
    const [overallOverview, setOverallOverview] = useState(null);
    const state = useSelector((state) => state);
    const entries = state.entries;

    useEffect(() => {
            fetch(apiPath + 'overallinfo', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Accept": "application/json",
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
                .then(json => {
                    setOverallOverview(json);
                }).catch((error) => {
                console.log(error)
            });
    }, [entries]);

    return (
        <div style={{marginBottom: '15px'}}>
            {overallOverview && <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
                <Grid item xs={12} sm={4} md={4}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Parkingerpladser i alt
                            </Typography>
                            <Avatar style={{margin: 'auto', backgroundColor: '#1A76D2', borderStyle: 'solid', width: 56, height:  56, borderWidth: '3px', borderColor: '#1A76D2'}}>
                                <SpaceBarIcon style={{color: 'white',  width: 36, height:  36}}/>
                            </Avatar>
                            <Typography variant="h5" component="div" style={{textAlign: 'center',  marginTop: '10px'}}>
                                {overallOverview.totalParkingSpaces}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Ledige parkeringsplader
                            </Typography>
                            <Avatar style={{margin: 'auto', backgroundColor: '#1A76D2', borderStyle: 'solid', width: 56, height:  56, borderWidth: '3px', borderColor: '#1A76D2'}}>
                                <CheckIcon style={{color: 'white',  width: 36, height:  36}}/>
                            </Avatar>
                            <Typography variant="h5" component="div" style={{textAlign: 'center', marginTop: '10px'}}>
                                {overallOverview.numbOfFreeParkingSpaces}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Ugyldige parkeringer
                            </Typography>
                            <Avatar style={{margin: 'auto', backgroundColor: '#1A76D2', borderStyle: 'solid', width: 56, height:  56, borderWidth: '3px', borderColor: '#1A76D2'}}>
                                <PriorityHighIcon style={{color: 'white',  width: 36, height:  36}}/>
                            </Avatar>
                            <Typography variant="h5" component="div" style={{textAlign: 'center', marginTop: '10px'}}>
                                {overallOverview.numbOfInvalidParkings}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>}
        </div>
    );
}

export default Cards;