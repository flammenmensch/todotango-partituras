import { SET_BUSY, SHOW_ERROR, HIDE_ERROR } from '../constants';

export default function(state={ busy: false, error: null }, action) {
  switch (action.type) {
    case SET_BUSY:
      return {
        ...state,
        busy: action.busy
      };
    case SHOW_ERROR:
      return {
        ...state,
        error: action.error
      };
    case HIDE_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}
