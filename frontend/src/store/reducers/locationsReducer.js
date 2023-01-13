const reducer = (state = null, action) => {
    switch (action.type) {
        case "setLocations":
            state = action.payload;
            return state;
        default:
            return state
    }
}

export default reducer;