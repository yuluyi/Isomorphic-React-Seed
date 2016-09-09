import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory as history } from 'react-router';
import GroundControl from '#/core/ground-control';
import Provider from '#/utils/ContextProvider';
import createStore from '#/createStore';
// import { combineReducers as loopCombineReducers } from 'redux-loop';
import domready from 'domready';
import routes from './routes';

import 'autotrack';
// if you use immutable for route reducers, set a property on route & use app level deserializer (optional)
// ...if you need to do something crazy like use combineReducers & immutable you can specify
// that on the route itself (see examples/full/index-route/index.js)

const deserializer = (route, data) => {
  // if (route.deserializeImmutable) return fromJS(data);
  return data;
};

const serializer = (route, data) => {
  // if (route.serializeImmutable) return data.toJS();
  return data;
};

const createClient = ({
  additionalReducers,
  enableReactRouterRedux,
  enableDevTools,
  enableThunk,
  // enableLoop,
  routes,
}) => {
  domready(() => {
    const { store, reducers, enhancedHistory} = createStore({
      additionalReducers,
      enableReactRouterRedux,
      enableDevTools,
      enableThunk,
      // enableLoop,
      history,
    });

    let groundControlsOpts = { store, serializer, deserializer, reducers };
    // if (enableLoop) groundControlsOpts = { ...groundControlsOpts, combineReducers: loopCombineReducers };
    const groundControlProps = props => ({ ...props, ...groundControlsOpts });

    const routerProps = () => ({
      routes,
      history: enhancedHistory,
      render: props => {
        return <GroundControl {...groundControlProps(props)} />;
      },
    });

    render(
      <Provider
        store={store}
        insertCss={styles => styles._insertCss()}
        setTitle={value => document.title = value}
        setMeta={(name, content) => {
          // Remove and create a new <meta /> tag in order to make it work
          // with bookmarks in Safari
          let elements = document.getElementsByTagName('meta');
          [].slice.call(elements).forEach((element) => {
            if (element.getAttribute('name') === name) {
              element.parentNode.removeChild(element);
            }
          });
          let meta = document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          document.getElementsByTagName('head')[0].appendChild(meta);
        }}>
        <Router {...routerProps()} />
      </Provider>,
      document.getElementById('app'));
  });
};

export default createClient;

createClient({
  enableReactRouterRedux: true,
  enableDevTools: !!__DEV__,
  enableThunk: true,
  // enableLoop: true,
  routes: routes,
  // additionalReducers: require('./store/reducers')
});
