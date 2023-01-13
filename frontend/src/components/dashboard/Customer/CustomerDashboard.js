import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {Alert, Card, CardContent, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import MyVehicles from "./MyVehicles";
import AddVehicle from "./AddVehicle";

function CustomerDashboard(props) {
    const [showAlertAddVehicle, setShowAlertAddVehicle] = useState(null);

    function handleShowAlertAddVehicle(msg) {
        setShowAlertAddVehicle(msg);
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography sx={{fontSize: 16, marginBottom: '5px'}} color="text.secondary" gutterBottom
                                        m={2.5}>
                                Mine køretøjer
                            </Typography>
                            <MyVehicles/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                    <Card style={{overflow: 'auto'}}>
                        <CardContent>
                            {showAlertAddVehicle &&
                            <Alert severity="error" sx={{width: '95%'}}>Følgende oplysninger mangler at blive udfyldt:
                                {showAlertAddVehicle.map((err, index) => (
                                    <li key={index}>{err}</li>
                                ))}
                            </Alert>}
                            <Typography sx={{fontSize: 16}} color="text.secondary" gutterBottom m={2.5}>
                                Tilføj køretøj
                            </Typography>
                            <AddVehicle handleShowAlertAddVehicle={handleShowAlertAddVehicle}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CustomerDashboard;