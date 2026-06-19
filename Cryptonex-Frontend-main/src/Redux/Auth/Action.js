import axios from "axios";
import * as actionTypes from "./ActionTypes";
import api, { API_BASE_URL } from "@/Api/api";
import { toast } from "react-toastify";

export const register = (userData) => async (dispatch) => {
  dispatch({ type: actionTypes.REGISTER_REQUEST });
  // Extract navigate so it's never sent in the JSON body
  const { navigate, ...requestData } = userData;
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/signup`,
      requestData,
    );
    const user = response.data;
    if (user.jwt) localStorage.setItem("jwt", user.jwt);
    console.log("registerr :- ", user);
    navigate("/");
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
  // Extract navigate so it's never sent in the JSON body
  const { navigate, ...requestData } = userData;
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/signin`,
      requestData,
    );
    const user = response.data;
    if (user.twoFactorAuthEnabled) {
      navigate(`/two-factor-auth/${user.session}`);
    }
    if (user.jwt) {
      localStorage.setItem("jwt", user.jwt);
      console.log("login ", user);
      navigate("/");
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
        },
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
    // If there's no token, skip the API call entirely
    if (!token) {
      dispatch({ type: actionTypes.GET_USER_FAILURE, payload: null });
      return;
    }
    dispatch({ type: actionTypes.GET_USER_REQUEST });

    // Retry up to 3 times to handle Render cold starts
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 3000; // 3 seconds between retries

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(
          `[getUser] Attempt ${attempt}/${MAX_RETRIES} — Fetching user profile from ${API_BASE_URL}/api/users/profile`,
        );
        const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 25000, // 25s per attempt (was 60s)
        });
        const user = response.data;
        dispatch({ type: actionTypes.GET_USER_SUCCESS, payload: user });
        console.log("[getUser] ✅ User loaded successfully:", user);
        return; // success — exit retry loop
      } catch (error) {
        const isRetryable =
          error.code === "ECONNABORTED" ||
          error.message?.includes("timeout") ||
          error.response?.status === 500 || // backend cold-start crash
          error.response?.status === 503;   // service unavailable
        console.error(`[getUser] ❌ Attempt ${attempt} failed:`, error.message);
        if (attempt < MAX_RETRIES && isRetryable) {
          console.log(`[getUser] ⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
          await new Promise((res) => setTimeout(res, RETRY_DELAY));
        } else {
          console.error("[getUser] API_BASE_URL:", API_BASE_URL);
          console.error("[getUser] Token:", token ? "✓ Present" : "✗ Missing");
          // Always resolve loading — never leave UI stuck on spinner
          dispatch({ type: actionTypes.GET_USER_FAILURE, payload: error.message });
          return;
        }
      }
    }
  };
};

export const sendVerificationOtp = ({ jwt, verificationType }) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SEND_VERIFICATION_OTP_REQUEST });
    try {
      const response = await api.post(
        `/api/users/verification/${verificationType}/send-otp`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
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
        },
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
        },
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
      toast.error(
        "Failed to enable Two-Step Authentication. Please try again.",
      );

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
        },
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
      },
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
        },
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
