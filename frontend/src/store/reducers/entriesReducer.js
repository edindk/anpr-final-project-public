const reducer = (state = null, action) => {
    switch (action.type) {
        case "setEntries":
            state = action.payload;
            return state;
        default:
            return state
    }
}

export default reducer;