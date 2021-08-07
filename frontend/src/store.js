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
  userChangePasswordReducer,
  userUpdateReducer,
  userRequestPasswordReset,
  userResetPassword,
  userUpdateDp,
} from "./reducers/user.reducers";
import {
  createCategoryReducer,
  categoryDetailsReducer,
  listCategoryReducer,
  updateCategoryReducer,
  deleteCategoryReducer,
  listAllCategoryReducer,
} from "./reducers/category.reducers";
import {
  createFaqReducer,
  faqDetailsReducer,
  listFaqReducer,
  updateFaqReducer,
  deleteFaqReducer,
} from "./reducers/faq.reducers";
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
  itemListAllReducer,
} from "./reducers/item.reducers";
import {
  carouselDeleteReducer,
  carouselDetailsReducer,
  carouselListReducer,
  carouselUpdateReducer,
  createCarouselReducer,
} from "./reducers/carousel.reducers";
import {
  salesListReducer,
  saleDetailsReducer,
  salesOfTheDayReducer,
  createSaleReducer,
  saleUpdateReducer,
  saleDeleteReducer,
} from "./reducers/sales.reducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userChangePassword: userChangePasswordReducer,
  userDelete: userDeleteReducer,
  userList: userListReducer,
  userUpdate: userUpdateReducer,
  userRequestPasswordReset: userRequestPasswordReset,
  userResetPassword: userResetPassword,
  userUpdateDp: userUpdateDp,
  categoryCreate: createCategoryReducer,
  categoryDetails: categoryDetailsReducer,
  categoryList: listCategoryReducer,
  categoryListAll: listAllCategoryReducer,
  categoryUpdate: updateCategoryReducer,
  categoryDelete: deleteCategoryReducer,
  faqCreate: createFaqReducer,
  faqDetails: faqDetailsReducer,
  faqList: listFaqReducer,
  faqUpdate: updateFaqReducer,
  faqDelete: deleteFaqReducer,
  itemCreate: createItemReducer,
  itemDetails: itemDetailsReducer,
  itemList: itemListReducer,
  itemListAll: itemListAllReducer,
  itemUpdate: itemUpdateReducer,
  itemDelete: itemDeleteReducer,
  itemAdd: addToItemReducer,
  itemRemove: removeFromItemReducer,
  itemOfTheDay: itemOfTheDayReducer,
  itemFavorite: favoriteItemReducer,
  itemUnfavorite: unfavoriteItemReducer,
  carouselCreate: createCarouselReducer,
  carouselList: carouselListReducer,
  carouselDelete: carouselDeleteReducer,
  carouselDetails: carouselDetailsReducer,
  carouselUpdate: carouselUpdateReducer,
  salesList: salesListReducer,
  salesDetail: saleDetailsReducer,
  salesOfTheDay: salesOfTheDayReducer,
  salesCreate: createSaleReducer,
  salesUpdate: saleUpdateReducer,
  salesDelete: saleDeleteReducer,
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
