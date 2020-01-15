import {combineReducers} from 'redux';

// import all reducer
import auth from './auth/auth';

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
