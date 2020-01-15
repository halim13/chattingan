const initialState = {
  message: '',
  isLoading: false,
  isError: false,
  error: '',
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_PENDING':
    case 'REGISTER_PENDING':
    case 'LOGOUT_PENDING':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_FULFILLED':
    case 'LOGOUT_FULFILLED':
    case 'REGISTER_FULFILLED':
      return {
        ...state,
        message: action.payload,
        isLoading: false,
        isError: false,
        error: '',
      };
    case 'LOGIN_REJECTED':
    case 'LOGOUT_REJECTED':
    case 'REGISTER_REJECTED':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isError: true,
        error: '',
      };
    default:
      return state;
  }
};
export default login;
