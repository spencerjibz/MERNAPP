import { combineReducers } from "redux";
import flashMessages from "./reducers/flashMessages";
import Auth from "./reducers/Auth";

export default combineReducers({
  flashMessages,
  Auth,
});
