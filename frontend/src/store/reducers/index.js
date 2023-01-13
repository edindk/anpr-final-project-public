import {combineReducers} from "redux";
import entriesReducer from "./entriesReducer";
import locationReducer from "./locationReducer";
import locationsReducer from "./locationsReducer";
import myVehiclesReducer from "./myVehiclesReducer";

const reducers = combineReducers({
    entries: entriesReducer,
    location: locationReducer,
    locations: locationsReducer,
    myVehicles: myVehiclesReducer
});

export default reducers;

