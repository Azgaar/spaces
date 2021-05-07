import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const getStoreMiddleware = async () => {
  if (process.env.NODE_ENV === 'development') {
    const {composeWithDevTools} = await import('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(thunk));
  }

  return applyMiddleware(thunk);
};

export const store = createStore(rootReducer, await getStoreMiddleware());
