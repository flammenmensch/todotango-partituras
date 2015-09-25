import 'whatwg-fetch';

import React from 'react/addons';
import { Provider } from 'react-redux';

import configureStore from './stores';
import App from './components/app';

const store = configureStore();

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.querySelector('#app-container')
);
