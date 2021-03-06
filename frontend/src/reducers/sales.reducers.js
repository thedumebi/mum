import {
  SALES_DETAILS_REQUEST,
  SALES_DETAILS_SUCCESS,
  SALES_DETAILS_FAIL,
  SALES_DETAILS_RESET,
  SALES_LIST_REQUEST,
  SALES_LIST_SUCCESS,
  SALES_LIST_FAIL,
  SALES_LIST_RESET,
  SALES_OF_THE_DAY_REQUEST,
  SALES_OF_THE_DAY_SUCCESS,
  SALES_OF_THE_DAY_FAIL,
  SALES_OF_THE_DAY_RESET,
  CREATE_SALES_REQUEST,
  CREATE_SALES_SUCCESS,
  CREATE_SALES_FAIL,
  CREATE_SALES_RESET,
  SALES_DELETE_REQUEST,
  SALES_DELETE_SUCCESS,
  SALES_DELETE_FAIL,
  SALES_DELETE_RESET,
  SALES_UPDATE_REQUEST,
  SALES_UPDATE_SUCCESS,
  SALES_UPDATE_FAIL,
  SALES_UPDATE_RESET,
} from "../constants/sales.constants";

export const saleDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case SALES_DETAILS_REQUEST:
      return { loading: true };
    case SALES_DETAILS_SUCCESS:
      return { loading: false, sale: action.payload };
    case SALES_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case SALES_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const salesListReducer = (state = [], action) => {
  switch (action.type) {
    case SALES_LIST_REQUEST:
      return { loading: true };
    case SALES_LIST_SUCCESS:
      return {
        loading: false,
        sales: action.payload.sales,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case SALES_LIST_FAIL:
      return { loading: false, error: action.payload };
    case SALES_LIST_RESET:
      return [];
    default:
      return state;
  }
};

export const salesOfTheDayReducer = (state = [], action) => {
  switch (action.type) {
    case SALES_OF_THE_DAY_REQUEST:
      return { loading: true };
    case SALES_OF_THE_DAY_SUCCESS:
      return {
        loadin: false,
        sales: action.payload.sales,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case SALES_OF_THE_DAY_FAIL:
      return { loading: false, error: action.payload };
    case SALES_OF_THE_DAY_RESET:
      return [];
    default:
      return state;
  }
};

export const createSaleReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SALES_REQUEST:
      return { loading: true };
    case CREATE_SALES_SUCCESS:
      return { loading: false, sale: action.payload, success: true };
    case CREATE_SALES_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_SALES_RESET:
      return {};
    default:
      return state;
  }
};

export const saleUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SALES_UPDATE_REQUEST:
      return { loading: true };
    case SALES_UPDATE_SUCCESS:
      return { loading: false, sale: action.payload, success: true };
    case SALES_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case SALES_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const saleDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SALES_DELETE_REQUEST:
      return { loading: true };
    case SALES_DELETE_SUCCESS:
      return { loading: false, success: true, message: action.payload.message };
    case SALES_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case SALES_DELETE_RESET:
      return {};
    default:
      return state;
  }
};