import React from 'react';
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

function NotFound(props) {
    let navigate = useNavigate();

    function redirect() {
        navigate('/');
    }

    return (
        <div style={{width: '100%', marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography component="h1" variant="h5">
                404 Error
            </Typography>
            <Typography variant="h6">
                We can't find the page that you're looking for
            </Typography>
            <Button
                type="submit"
                variant="contained"
                sx={{mt: 3, mb: 2}}
                onClick={redirect}
            >
                Back to home
            </Button>
        </div>
    );
}

export default NotFound;