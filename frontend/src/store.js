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
import {
  createCategoryReducer,
  categoryDetailsReducer,
  listCategoryReducer,
  updateCategoryReducer,
  deleteCategoryReducer,
} from "./reducers/category.reducers";
import {
  addToItemReducer,
  createItemReducer,
  favoriteItemReducer,
  itemDeleteReducer,
  itemDetailsReducer,
  itemListReducer,
  itemOfTheDayReducer,
  itemUpdateReducer,
  removeFromItemReducer,
  unfavoriteItemReducer,
} from "./reducers/item.reducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userDelete: userDeleteReducer,
  userList: userListReducer,
  userUpdate: userUpdateReducer,
  categoryCreate: createCategoryReducer,
  categoryDetails: categoryDetailsReducer,
  categoryList: listCategoryReducer,
  categoryUpdate: updateCategoryReducer,
  categoryDelete: deleteCategoryReducer,
  itemCreate: createItemReducer,
  itemDetails: itemDetailsReducer,
  itemList: itemListReducer,
  itemUpdate: itemUpdateReducer,
  itemDelete: itemDeleteReducer,
  itemAdd: addToItemReducer,
  itemRemove: removeFromItemReducer,
  itemOfTheDay: itemOfTheDayReducer,
  itemFavorite: favoriteItemReducer,
  itemUnfavorite: unfavoriteItemReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
