import { combineReducers } from 'redux';

import app from './app';
import search from './search';

const reducers = combineReducers({
  app,
  search
});

export default reducers;
