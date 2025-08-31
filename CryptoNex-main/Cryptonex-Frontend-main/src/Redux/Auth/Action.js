import axios from "axios";
import * as actionTypes from "./ActionTypes";
import api, { API_BASE_URL } from "@/Api/api";
import { toast } from "react-toastify";


export const register = (userData) => async (dispatch) => {
  dispatch({ type: actionTypes.REGISTER_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;
    if (user.jwt) localStorage.setItem("jwt", user.jwt);
    console.log("registerr :- ", user);
    userData.navigate("/");
    dispatch({ type: actionTypes.REGISTER_SUCCESS, payload: user.jwt });
  } catch (error) {
    console.log("error ", error);
    dispatch({
      type: actionTypes.REGISTER_FAILURE,
      payload: error.response?.data ? error.response.data : error,
    });
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: actionTypes.LOGIN_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const user = response.data;
    if (user.twoFactorAuthEnabled) {
      userData.navigate(`/two-factor-auth/${user.session}`);
    }
    if (user.jwt) {
      localStorage.setItem("jwt", user.jwt);
      console.log("login ", user);
      userData.navigate("/");
    }
    dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: user.jwt });
  } catch (error) {
    console.log("catch error", error);
    dispatch({
      type: actionTypes.LOGIN_FAILURE,
      payload: error.response?.data ? error.response.data : error,
    });
  }
};

export const twoStepVerification =
  ({ otp, session, navigate }) =>
  async (dispatch) => {
    dispatch({ type: actionTypes.LOGIN_TWO_STEP_REQUEST });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/two-factor/otp/${otp}`,
        {},
        {
          params: { id: session },
        }
      );
      const user = response.data;

      if (user.jwt) {
        localStorage.setItem("jwt", user.jwt);
        console.log("login ", user);
        navigate("/");
      }
      dispatch({ type: actionTypes.LOGIN_TWO_STEP_SUCCESS, payload: user.jwt });
    } catch (error) {
      console.log("catch error", error);
      dispatch({
        type: actionTypes.LOGIN_TWO_STEP_FAILURE,
        payload: error.response?.data ? error.response.data : error,
      });
    }
  };

//  get user from token
export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_USER_REQUEST });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;
      dispatch({ type: actionTypes.GET_USER_SUCCESS, payload: user });
      console.log("req User ", user);
    } catch (error) {
      const errorMessage = null;
      dispatch({ type: actionTypes.GET_USER_FAILURE, payload: errorMessage });
    }
  };
};

export const sendVerificationOtp = ({ jwt, verificationType }) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SEND_VERIFICATION_OTP_REQUEST });
    try {
      const response = await api.post(
        `/api/users/verification/${verificationType}/send-otp`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const user = response.data;
      dispatch({
        type: actionTypes.SEND_VERIFICATION_OTP_SUCCESS,
        payload: user,
      });

      // Show success toast
      toast.success("OTP sent successfully to your registered email.");
      console.log("send otp ", user);
    } catch (error) {
      console.log("error ", error);

      // Show error toast
      toast.error("Failed to send OTP. Please try again.");

      const errorMessage = error.message;
      dispatch({
        type: actionTypes.SEND_VERIFICATION_OTP_FAILURE,
        payload: errorMessage,
      });
    }
  };
};


export const verifyOtp = ({ jwt, otp }) => {
  console.log("jwt", jwt);
  return async (dispatch) => {
    dispatch({ type: actionTypes.VERIFY_OTP_REQUEST });
    try {
      const response = await api.patch(
        `/api/users/verification/verify-otp/${otp}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const user = response.data;

      // Update user object in the store
      dispatch({ type: actionTypes.VERIFY_OTP_SUCCESS, payload: user });

      // Show success toast
      toast.success("Verification successful! Your account is now verified.");
      console.log("verify otp ", user);
    } catch (error) {
      console.log("error ", error);

      // Show error toast
      toast.error("Verification failed. Please check your OTP and try again.");

      const errorMessage = error.message;
      dispatch({ type: actionTypes.VERIFY_OTP_FAILURE, payload: errorMessage });
    }
  };
};


export const enableTwoStepAuthentication = ({ jwt, otp }) => {
  console.log("jwt", jwt);
  return async (dispatch) => {
    dispatch({ type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_REQUEST });
    try {
      const response = await api.patch(
        `/api/users/enable-two-factor/verify-otp/${otp}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const user = response.data;

      // Update user object in the store
      dispatch({
        type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
        payload: user,
      });

      // Show success toast
      toast.success("Two-Step Authentication enabled successfully!");
      console.log("enable two-step authentication ", user);
    } catch (error) {
      console.log("error ", error);

      // Show error toast
      toast.error("Failed to enable Two-Step Authentication. Please try again.");

      const errorMessage = error.message;
      dispatch({
        type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
        payload: errorMessage,
      });
    }
  };
};



export const sendResetPassowrdOTP = ({
  sendTo,
  verificationType,
  navigate,
}) => {
  console.log("send otp ", sendTo);
  return async (dispatch) => {
    dispatch({ type: actionTypes.SEND_RESET_PASSWORD_OTP_REQUEST });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/users/reset-password/send-otp`,
        {
          sendTo,
          verificationType,
        }
      );
      const user = response.data;
      navigate(`/reset-password/${user.session}`);
      dispatch({
        type: actionTypes.SEND_RESET_PASSWORD_OTP_SUCCESS,
        payload: user,
      });
      console.log("otp sent successfully ", user);
    } catch (error) {
      console.log("error ", error);
      const errorMessage = error.message;
      dispatch({
        type: actionTypes.SEND_RESET_PASSWORD_OTP_FAILURE,
        payload: errorMessage,
      });
    }
  };
};


export const updateUserInformation = (updatedInfo) => async (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_USER_INFORMATION_REQUEST });

  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("No JWT token found");

    const response = await axios.patch(
      `${API_BASE_URL}/api/users/update-information`,
      updatedInfo,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    

    dispatch({
      type: actionTypes.UPDATE_USER_INFORMATION_SUCCESS,
      payload: response.data,
    });

    
  } catch (error) {
    dispatch({
      type: actionTypes.UPDATE_USER_INFORMATION_FAILURE,
      payload: error.response?.data?.error || "Failed to update profile.",
    });
  }
};








export const verifyResetPassowrdOTP = ({
  otp,
  password,
  session,
  navigate,
}) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.VERIFY_RESET_PASSWORD_OTP_REQUEST });
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/auth/users/reset-password/verify-otp`,
        {
          otp,
          password,
        },
        {
          params: {
            id: session,
          },
        }
      );
      const user = response.data;
      dispatch({
        type: actionTypes.VERIFY_RESET_PASSWORD_OTP_SUCCESS,
        payload: user,
      });
      navigate("/password-update-successfully");
      console.log("VERIFY otp successfully ", user);
    } catch (error) {
      console.log("error ", error);
      const errorMessage = error.message;
      dispatch({
        type: actionTypes.VERIFY_RESET_PASSWORD_OTP_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.LOGOUT });
    localStorage.clear();
  };
};
