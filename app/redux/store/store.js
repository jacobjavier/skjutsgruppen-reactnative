/* global __DEV__ */

import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from '@redux/reducers/reducers';
import Apollo from '@services/apollo';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

const NavMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['nav'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const congifureStore = (initialState = {}) => {
  const middlewares = [thunk];

  if (__DEV__) {
    middlewares.push(logger);
  }

  middlewares.push(Apollo.middleware());
  middlewares.push(NavMiddleware);

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const store = createStore(persistedReducer, initialState, compose(...enhancers));

  const persistor = persistStore(store);

  return { persistor, store };
};

export default congifureStore;
