import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {
  userLoginReducer,
  userDetailsReducer,
  userDeleteReducer,
  userListReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/user.reducers";

const reducer = combineReducers({
  loginUser: userLoginReducer,
  registerUser: userRegisterReducer,
  userDetails: userDetailsReducer,
  updateUserProfile: userUpdateProfileReducer,
  deleteUser: userDeleteReducer,
  listUsers: userListReducer,
  updateUser: userUpdateReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  loginUser: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
