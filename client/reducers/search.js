import { UPDATE_SEARCH_RESULTS } from '../constants';

export default function(state={ searchResults: [] }, action) {
  switch (action.type) {
    case UPDATE_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.results
      };
    default:
      return state;
  }
}
