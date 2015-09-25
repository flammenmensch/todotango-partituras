import { SET_BUSY, SHOW_ERROR } from '../constants';

export function setBusy(value) {
  return { type: SET_BUSY, busy: value };
}

export function showError(error) {
  return { type: SHOW_ERROR, error: error };
}
