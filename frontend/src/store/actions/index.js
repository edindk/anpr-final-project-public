export const setEntries = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'setEntries',
            payload: data
        })
    }
}

export const setLocation = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'setLocation',
            payload: data
        })
    }
}

export const setLocations = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'setLocations',
            payload: data
        })
    }
}

export const setMyVehicles = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'setMyVehicles',
            payload: data
        })
    }
}