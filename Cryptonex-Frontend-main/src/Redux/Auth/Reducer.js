import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
  LOGIN_TWO_STEP_FAILURE,
  LOGIN_TWO_STEP_SUCCESS,
  VERIFY_OTP_SUCCESS,
  ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
  UPDATE_USER_INFORMATION_REQUEST,
  UPDATE_USER_INFORMATION_SUCCESS,
  UPDATE_USER_INFORMATION_FAILURE,
  RESET_UPDATE_SUCCESS
  

} from "./ActionTypes";

const initialState = {
  user: null,
  loading: false,
  error: null,
  jwt: null,
  // Add a success flag for profile updates
  updateSuccess: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case REGISTER_SUCCESS:
      return { ...state, loading: false, jwt:action.payload };

    case LOGIN_SUCCESS:
      return { ...state, loading: false, jwt: action.payload };

      case LOGIN_TWO_STEP_SUCCESS:
      return { ...state, loading: false, jwt: action.payload };

    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        fetchingUser: false,
        
      };

      case RESET_UPDATE_SUCCESS:
  return {
    ...state,
    updateSuccess: false, // Reset the success flag explicitly
  };
       case UPDATE_USER_INFORMATION_REQUEST:
  return {
    ...state,
    loading: true, // Begin loading
    updateSuccess: false, // Reset success flag
  };

case UPDATE_USER_INFORMATION_SUCCESS:
  return {
    ...state,
    loading: false, // End loading
    user: action.payload, // Update user data
    updateSuccess: true, // Set success flag
  };

case UPDATE_USER_INFORMATION_FAILURE:
  return {
    ...state,
    loading: false, // End loading
    error: action.payload, // Record error
    updateSuccess: false, // Ensure success flag is false
  };




       
      

      case VERIFY_OTP_SUCCESS:
        return {
          ...state,
          user: { ...state.user, verified: true }, // Update 'verified' status
        };

      case ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS:
        return {
          ...state,
          user: {
            ...state.user,
            twoFactorAuth: { ...state.user.twoFactorAuth, enabled: true }, // Enable two-factor auth
          },
        };


    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case GET_USER_FAILURE:
    case LOGIN_TWO_STEP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem("jwt");
      return { ...state, jwt: null, user: null };
    default:
      return state;
  }
};

export default authReducer;
