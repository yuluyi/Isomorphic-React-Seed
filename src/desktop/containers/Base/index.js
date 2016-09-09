import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {createAction, createReducer} from 'redux-act';
import style from './index.scss';
import {user} from '#/apis';
import {login} from '#/desktop/store/actions';
import storage from '#/utils/storage';
import setTitle from '#/utils/setTitle';
import setMeta from '#/utils/setMeta';

export const asyncEnter = (done, {
  routeParams,
  queryParams,
  dispatch,
  clientRender,
  serverRender,
  isInitialLoad,
  isClient,
  isMounted,
  getReducerState,
  err,
  redirect
}) => {
  if(isInitialLoad()) return done();
  setMeta('keywords', 'keywords');
  clientRender();
  user()
  .read()
  .then(({res, err}) => {
    if(err && err.status === 401) {
      storage('authToken', null);
      dispatch(login({}));
      return;
    };
    dispatch(login(res))
  })
  .then(() => done())
  .then(() => serverRender())
}

class Base extends Component {
  render() {
    return (
      <div className={style.base}>
        {this.props.children}
      </div>
    )
  }
}

export default withStyles(style)(Base);
