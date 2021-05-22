import {
  CREATE_FAQ_REQUEST,
  CREATE_FAQ_SUCCESS,
  CREATE_FAQ_FAIL,
  CREATE_FAQ_RESET,
  FAQ_DETAILS_REQUEST,
  FAQ_DETAILS_SUCCESS,
  FAQ_DETAILS_FAIL,
  FAQ_DETAILS_RESET,
  FAQ_LIST_REQUEST,
  FAQ_LIST_SUCCESS,
  FAQ_LIST_FAIL,
  FAQ_LIST_RESET,
  FAQ_UPDATE_REQUEST,
  FAQ_UPDATE_SUCCESS,
  FAQ_UPDATE_FAIL,
  FAQ_UPDATE_RESET,
  FAQ_DELETE_REQUEST,
  FAQ_DELETE_SUCCESS,
  FAQ_DELETE_FAIL,
} from "../constants/faq.constants";

export const createFaqReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_FAQ_REQUEST:
      return { loading: true };
    case CREATE_FAQ_SUCCESS:
      return { loading: false, faq: action.payload, status: true };
    case CREATE_FAQ_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_FAQ_RESET:
      return {};
    default:
      return state;
  }
};

export const faqDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case FAQ_DETAILS_REQUEST:
      return { loading: true };
    case FAQ_DETAILS_SUCCESS:
      return { loading: false, faq: action.payload };
    case FAQ_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case FAQ_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const listFaqReducer = (state = [], action) => {
  switch (action.type) {
    case FAQ_LIST_REQUEST:
      return { loading: true };
    case FAQ_LIST_SUCCESS:
      return {
        loading: false,
        faqs: action.payload.faqs,
        pages: action.payload.pages,
        page: action.payload.pages,
      };
    case FAQ_LIST_FAIL:
      return { loading: false, error: action.payload };
    case FAQ_LIST_RESET:
      return [];
    default:
      return state;
  }
};

export const updateFaqReducer = (state = {}, action) => {
  switch (action.type) {
    case FAQ_UPDATE_REQUEST:
      return { loading: true };
    case FAQ_UPDATE_SUCCESS:
      return { loading: false, faq: action.payload, success: true };
    case FAQ_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case FAQ_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const deleteFaqReducer = (state = {}, action) => {
  switch (action.type) {
    case FAQ_DELETE_REQUEST:
      return { loading: true };
    case FAQ_DELETE_SUCCESS:
      return { loading: false, success: true, message: action.payload.message };
    case FAQ_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
