import { 
  USER_AUTH, 
  USER_REGISTER, 
  USER_DETAILS, 
  USER_PROFILE_UPDATE 
} from "../constants/userConstants";

// Initial state
const userInitialState = {
  userLogin: { userInfo: null, loading: false, error: null },
  userRegister: { loading: false, userInfo: null, error: null },
  userDetails: { loading: false, user: null, error: null },
  userProfileUpdate: { loading: false, success: false, error: null },
};

// Helper function to update state
const updateState = (state, key, updates) => ({
  ...state,
  [key]: { ...state[key], ...updates }
});

// Reducer
const userReducer = (state = userInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // Handle login and register requests
    case USER_AUTH.LOGIN_REQUEST:
    case USER_REGISTER.REQUEST:
      return updateState(state, type === USER_AUTH.LOGIN_REQUEST ? 'userLogin' : 'userRegister', {
        loading: true,
        error: null,
        userInfo: null,
      });

    // Handle login and register success
    case USER_AUTH.LOGIN_SUCCESS:
    case USER_REGISTER.SUCCESS:
      return updateState(state, type === USER_AUTH.LOGIN_SUCCESS ? 'userLogin' : 'userRegister', {
        loading: false,
        userInfo: payload,
        error: null,
      });

    // Handle login and register fail
    case USER_AUTH.LOGIN_FAIL:
    case USER_REGISTER.FAIL:
      return updateState(state, type === USER_AUTH.LOGIN_FAIL ? 'userLogin' : 'userRegister', {
        loading: false,
        error: payload,
        userInfo: null,
      });

    // Handle user logout
    case USER_AUTH.LOGOUT:
      return updateState(state, 'userLogin', {
        userInfo: null,
        loading: false,
        error: null,
      });

    // Handle fetching user details
    case USER_DETAILS.REQUEST:
      return updateState(state, 'userDetails', { loading: true });

    case USER_DETAILS.SUCCESS:
      return updateState(state, 'userDetails', {
        loading: false,
        user: payload,
        error: null,
      });

    case USER_DETAILS.FAIL:
      return updateState(state, 'userDetails', {
        loading: false,
        error: payload,
      });

    // Handle profile update requests
    case USER_PROFILE_UPDATE.REQUEST:
      return updateState(state, 'userProfileUpdate', {
        loading: true,
        success: false,
        error: null,
      });

    case USER_PROFILE_UPDATE.SUCCESS:
      return updateState(state, 'userProfileUpdate', {
        loading: false,
        success: true,
        error: null,
      });

    case USER_PROFILE_UPDATE.FAIL:
      return updateState(state, 'userProfileUpdate', {
        loading: false,
        success: false,
        error: payload,
      });

    default:
      return state;
  }
};

export { userReducer, userInitialState };
