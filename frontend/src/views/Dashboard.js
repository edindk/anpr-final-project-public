import React from 'react';
import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import AdminDashboard from "../components/dashboard/Admin/AdminDashboard";
import CustomerDashboard from "../components/dashboard/Customer/CustomerDashboard";
import {useDispatch} from "react-redux";
import bindActionCreators from "react-redux/es/utils/bindActionCreators";
import {actionCreators} from "../store";
import Pusher from 'pusher-js';

var pusher = new Pusher('14...', {
    cluster: 'eu'
});

var channel = pusher.subscribe('entries-channel');

function Dashboard(props) {
    const dispatch = useDispatch();
    const {setEntries} = bindActionCreators(actionCreators, dispatch);
    let user = null;

    if (localStorage.getItem('user')) {
        user = JSON.parse(localStorage.getItem('user'))
    }

    channel.bind('entries-event', function (data) {
        const imagePath = process.env.REACT_APP_IMAGES_PATH;
        let tempRows = [];

        data['message'].forEach((item) => {
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

        const event = new CustomEvent('showSnackbar', {
            detail: {
                vehicle: tempRows[tempRows.length - 1]
            }
        });
        document.dispatchEvent(event);

        sortEntries(tempRows);
        setEntries(tempRows);
    });

    function sortEntries(entries) {
        entries.sort(function (entry1, entry2) {
            return new Date(entry2.entryDate) - new Date(entry1.entryDate);
        });
    }

    return (
        <Container maxWidth="xl">
            <div style={{display: 'flex'}}>
                <Typography m={2.5}
                            variant="h6"
                            color="textSecondary"
                            component="h2"
                            gutterBottom
                >
                    Dashboard
                </Typography>
            </div>
            {user && <div>
                {user.role === 'Admin' ? <AdminDashboard/> : <CustomerDashboard/>}
            </div>}
        </Container>
    );
}

export default Dashboard;