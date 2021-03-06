import {createStore, applyMiddleware, compose, combineReducers as reduxCombineReducers} from 'redux';
import {syncHistoryWithStore, routerReducer, routerMiddleware} from 'react-router-redux';
import {NAMESPACE} from '#/core/ground-control/modules/constants';
// import {install as installLoop, combineReducers as loopCombineReducers} from 'redux-loop';
import isEmpty from 'lodash/isEmpty';
import thunk from 'redux-thunk';

export default({
  additionalReducers,
  enableReactRouterRedux,
  enableDevTools,
  enableThunk,
  // enableLoop,
  history
}) => {
  let middleware = [];
  let reactRouterReduxMiddleware;
  if (enableThunk)
    middleware = middleware.concat(thunk);
  if (enableReactRouterRedux && history)
    reactRouterReduxMiddleware = routerMiddleware(history);
  if (reactRouterReduxMiddleware)
    middleware = middleware.concat(reactRouterReduxMiddleware);

  let storeEnhancers = [];
  // if (enableLoop)
  //   storeEnhancers = storeEnhancers.concat(installLoop()); // this should come last, but devtools causes issue
  if (enableDevTools)
    storeEnhancers = storeEnhancers.concat(window.devToolsExtension
      ? window.devToolsExtension()
      : f => f);

  const reducers = additionalReducers && !isEmpty(additionalReducers)
    ? additionalReducers
    : {};
  if (enableReactRouterRedux)
    reducers.routing = routerReducer;

  const defaultReducer = (state = {}) => state;
  const cr = reduxCombineReducers;
  const reducer = isEmpty(reducers)
    ? defaultReducer
    : cr({
      [NAMESPACE]: defaultReducer, // need to set if using combineReducers top level...
      ...reducers
    });
  const store = createStore(reducer, {}, compose(applyMiddleware(...middleware), ...storeEnhancers));
  let enhancedHistory;
  if (enableReactRouterRedux && history)
    enhancedHistory = syncHistoryWithStore(history, store);

  // if (reactRouterReduxMiddleware)
  //   reactRouterReduxMiddleware.listenForReplays(store);
  return {store, reducers, enhancedHistory};
};
