import axios from "axios";
import {
  CREATE_FAQ_REQUEST,
  CREATE_FAQ_SUCCESS,
  CREATE_FAQ_FAIL,
  FAQ_DETAILS_REQUEST,
  FAQ_DETAILS_SUCCESS,
  FAQ_DETAILS_FAIL,
  FAQ_LIST_REQUEST,
  FAQ_LIST_SUCCESS,
  FAQ_LIST_FAIL,
  FAQ_UPDATE_REQUEST,
  FAQ_UPDATE_SUCCESS,
  FAQ_UPDATE_FAIL,
  FAQ_DELETE_FAIL,
  FAQ_DELETE_REQUEST,
  FAQ_DELETE_SUCCESS,
} from "../constants/faq.constants";

export const createFaq = (faq) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_FAQ_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/faqs`, faq, config);

    dispatch({
      type: CREATE_FAQ_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_FAQ_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getFaqDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: FAQ_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/faqs/${id}`);

    dispatch({
      type: FAQ_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FAQ_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getFaqs =
  (keyword = "", pageNumber = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: FAQ_LIST_REQUEST });

      const { data } = await axios.get(
        `/api/faqs?keyword=${keyword}&pageNumber=${pageNumber}`
      );

      dispatch({
        type: FAQ_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FAQ_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateFaq = (id, faq) => async (dispatch, getState) => {
  try {
    dispatch({ type: FAQ_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(`/api/faqs/${id}`, faq, config);

    dispatch({
      type: FAQ_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FAQ_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteFaq = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FAQ_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/faqs/${id}`, config);

    dispatch({
      type: FAQ_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FAQ_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
