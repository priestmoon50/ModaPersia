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

// Mapping keys to the corresponding state slice
const stateKeysMap = {
  [USER_AUTH.LOGIN_REQUEST]: 'userLogin',
  [USER_AUTH.LOGIN_SUCCESS]: 'userLogin',
  [USER_AUTH.LOGIN_FAIL]: 'userLogin',
  [USER_REGISTER.REQUEST]: 'userRegister',
  [USER_REGISTER.SUCCESS]: 'userRegister',
  [USER_REGISTER.FAIL]: 'userRegister',
  [USER_AUTH.LOGOUT]: 'userLogin',
  [USER_DETAILS.REQUEST]: 'userDetails',
  [USER_DETAILS.SUCCESS]: 'userDetails',
  [USER_DETAILS.FAIL]: 'userDetails',
  [USER_PROFILE_UPDATE.REQUEST]: 'userProfileUpdate',
  [USER_PROFILE_UPDATE.SUCCESS]: 'userProfileUpdate',
  [USER_PROFILE_UPDATE.FAIL]: 'userProfileUpdate',
};

// Reducer
const userReducer = (state = userInitialState, action) => {
  const { type, payload } = action;

  // Check if the action type exists in the state keys map
  if (stateKeysMap[type]) {
    switch (type) {
      case USER_AUTH.LOGIN_REQUEST:
      case USER_REGISTER.REQUEST:
        return updateState(state, stateKeysMap[type], {
          loading: true,
          error: null,
          userInfo: null,
        });

      case USER_AUTH.LOGIN_SUCCESS:
      case USER_REGISTER.SUCCESS:
        return updateState(state, stateKeysMap[type], {
          loading: false,
          userInfo: payload,
          error: null,
        });

      case USER_AUTH.LOGIN_FAIL:
      case USER_REGISTER.FAIL:
        return updateState(state, stateKeysMap[type], {
          loading: false,
          error: payload,
          userInfo: null,
        });

      case USER_AUTH.LOGOUT:
        return updateState(state, 'userLogin', {
          userInfo: null,
          loading: false,
          error: null,
        });

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
  }

  return state;
};
 
export { userReducer, userInitialState };
