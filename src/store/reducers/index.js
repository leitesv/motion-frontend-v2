import { combineReducers } from "redux";
import myProgramsReducer from './myProgramsReducer';
import defaultReducer from './defaultReducer';
import userReducer from './userReducer';
//import commonReducer from './common/reducers';
//import tabReducer from './tabs/reducers';

function lastAction(state = null, action) {
  return action;
}

const reducers = combineReducers({
  lastAction: lastAction,
  userAction: userReducer,
  // commonAction: commonReducer,
  myPrograms: myProgramsReducer,
  //tabData: tabReducer,
  userImages: defaultReducer,
  user: defaultReducer,
  registerForm: defaultReducer,
  loginForm: defaultReducer,
  registerFormFeedback: defaultReducer,
  loginFormFeedback: defaultReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'USERS.LOGOUT') {
    state = undefined;
  }

  if (action.type === 'update') {
    let key = action.payload.key;
    let subkey = action.payload.subkey;
    let value = action.payload.value;
    let obj = {};

    if (subkey)
    {
      if (!obj[key]) obj[key] = state[key];
      obj[key][subkey] = value;
    }
    else
    {
      obj[key] = value;
    }

    return Object.assign({}, state, obj);
  }

  return reducers(state, action);
};

export default rootReducer;
