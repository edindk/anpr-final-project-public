const reducer = (state = null, action) => {
    switch (action.type) {
        case "setMyVehicles":
            state = action.payload;
            return state;
        default:
            return state
    }
}

export default reducer;