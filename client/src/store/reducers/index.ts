import {combineReducers} from "redux";
import userReducer from "./user";

// Placeholder to add more reducers
const rootReducer = combineReducers({user: userReducer});

export default rootReducer;
