import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const storeMiddleware = process.env.NODE_ENV === "development" ? composeWithDevTools(applyMiddleware(thunk)) : applyMiddleware(thunk);
export const store = createStore(rootReducer, storeMiddleware);
