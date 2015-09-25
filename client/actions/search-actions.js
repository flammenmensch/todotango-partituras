import { UPDATE_SEARCH_RESULTS } from '../constants';
import * as appActions from './app-actions';
import * as api from '../services/api-service';


export function updateSearchResults(results) {
  return { type: UPDATE_SEARCH_RESULTS, results };
}

export function search(query) {
  return dispatch => {
    dispatch(appActions.setBusy(true));

    api.search(query)
      .then(results => {
        dispatch(appActions.setBusy(false));
        dispatch(updateSearchResults(results));
      })
      .catch(error => {
        dispatch(appActions.setBusy(false));
        dispatch(appActions.showError(error))
      });
  }
}
