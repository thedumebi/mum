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
    default:
      return state;
  }
};
