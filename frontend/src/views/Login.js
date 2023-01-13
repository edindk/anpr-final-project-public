import React, {useState} from 'react';
import {Alert, Avatar, Button, Container, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";

function Login(props) {
    const apiPath = process.env.REACT_APP_API_PATH;
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState(null);

    function redirect() {
        navigate('/');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        fetch(apiPath + 'login', {
            method: "POST",
            body: JSON.stringify({
                email: data.get('email'),
                password: data.get('password')
            }),
            headers: {"Accept": "application/json", 'Content-Type': 'application/json'}
        }).then(response => response.json())
            .then(json => {
                localStorage.setItem('user', JSON.stringify({
                    'email': json.user.email,
                    'name': json.user.name,
                    'role': json.user.role,
                    'id': json.user.id,
                    'location': json.user.location?.address
                }));

                localStorage.setItem('token', json.token);
                redirect();
            }).catch((error) => {
            setErrMsg('Forkert brugernavn eller adgangskode')
            localStorage.setItem('token', null);
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            {errMsg && <Alert severity="error">{errMsg}</Alert>}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: '#1A76D2'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log ind
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        error={errMsg !== null}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Brugernavn"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        error={errMsg !== null}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Adgangskode"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Log ind
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;