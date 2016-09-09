import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';
import * as Base from '#/desktop/containers/Base';
import * as Home from '#/desktop/containers/Home';


export default(
  <Route component={Base.default} asyncEnter={Base.asyncEnter}>
    <Route path="/" component={Home.default} asyncEnter={Home.asyncEnter} reducer={Home.reducer} />
  </Route>
)
