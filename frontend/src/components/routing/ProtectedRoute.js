import React, {useState} from 'react';
import {Navigate, Outlet} from 'react-router-dom';

function ProtectedRoute() {
    const [validToken, setValidToken] = useState(true);
    // const user = localStorage.getItem('user');

    const apiPath = process.env.REACT_APP_API_PATH;
    fetch(apiPath + 'checktoken', {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Accept": "application/json",
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(json => {
            setValidToken(json[0] === 'Token is valid');
        });

    return (validToken ? <Outlet/> : <Navigate to="/login"/>)
}

export default ProtectedRoute;
