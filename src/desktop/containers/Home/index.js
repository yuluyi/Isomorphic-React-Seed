import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {createAction, createReducer} from 'redux-act';
import style from './index.scss';
import Header from '#/desktop/containers/Header';
import {topics} from '#/apis';
import {login, fetchTopicList, fetchInformation, fetchLiveDetail} from '#/desktop/store/actions';
import Footer from '#/desktop/containers/Footer';
import Loading from '#/common/Loading';

export const reducer = createReducer({
  [fetchTopicList]: (state, payload) => ({...state, topics: payload}),
  [login]: (state, payload) => ({...state, user: payload}),
  [fetchInformation]: (state, payload) => ({...state, information: payload, liveDetail: null}),
  [fetchLiveDetail]: (state, payload) => ({...state, liveDetail: payload, information: null})
}, {
  topics: {
    data: []
  },
  user: {}
})

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
  clientRender();
  topics().list({
    query: {
      topic_name: 'DT_news'
    }
  })
  .then(({res, err}) => {
    dispatch(fetchTopicList(res));
  })
  .then(() => done())
  .then(() => serverRender())
}

class Home extends Component {
  render() {
    return(
      <div className={style.home}>
        <Header {...this.props.data} location={this.props.location}/>
        {this.props.children}
        {this.props.children.props.loading
          ? null
          : <Footer />}
      </div>
    )
  }
}

export default withStyles(style)(Home);
