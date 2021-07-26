import axios from "axios";
import {
  SALES_DETAILS_REQUEST,
  SALES_DETAILS_SUCCESS,
  SALES_DETAILS_FAIL,
  SALES_LIST_REQUEST,
  SALES_LIST_SUCCESS,
  SALES_LIST_FAIL,
  SALES_OF_THE_DAY_REQUEST,
  SALES_OF_THE_DAY_SUCCESS,
  SALES_OF_THE_DAY_FAIL,
  CREATE_SALES_REQUEST,
  CREATE_SALES_SUCCESS,
  CREATE_SALES_FAIL,
} from "../constants/sales.constants";

export const createSale = (sale) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_SALES_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/sales`, sale, config);

    dispatch({
      type: CREATE_SALES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_SALES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getSaleDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SALES_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/sales/${id}`, config);

    dispatch({ type: SALES_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SALES_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getSales =
  (keyword = "", pageNumber = "") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: SALES_LIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/sales?keyword=${keyword}&pageNumber=${pageNumber}`,
        config
      );

      dispatch({ type: SALES_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: SALES_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getSalesOfTheDay =
  (keyword = "", pageNumber = "") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: SALES_OF_THE_DAY_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/sales/today?keyword=${keyword}&pageNumber=${pageNumber}`,
        config
      );

      dispatch({ type: SALES_OF_THE_DAY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: SALES_OF_THE_DAY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
