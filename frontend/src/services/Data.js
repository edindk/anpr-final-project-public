const apiPath = process.env.REACT_APP_API_PATH;

export async function fetchLocations() {
    let locations = [];

    await fetch(apiPath + 'locations', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Accept": "application/json",
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(json => {
            json['data'].forEach((item) => {
                locations.push(item);
            });
        }).catch((error) => {
            console.log(error)
        });
    return locations;
}

export async function getMyVehicles() {
    let tempMyVehicles = [];

    await fetch(apiPath + 'vehicles', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Accept": "application/json",
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(json => {
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
        }).catch((error) => {
            console.log(error)
        });
    return tempMyVehicles;
}

