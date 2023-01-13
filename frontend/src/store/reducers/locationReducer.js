const reducer = (state = null, action) => {
    switch (action.type) {
        case "setLocation":
            state = action.payload;
            return state;
        default:
            return state
    }
}

export default reducer;