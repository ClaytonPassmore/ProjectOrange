// @flow
import { combineReducers } from 'redux';
import user from './user';
import tabs from './tabs';
import library from './library';
import discover from './discover';

const appReducer = combineReducers({
  user,
  tabs,
  library,
  discover,
});

const rootReducer = (state, action) => {
	if (action.type === 'LOGGED_OUT') {
		state = undefined;
	}
  return appReducer(state, action);
}

module.exports = rootReducer;
