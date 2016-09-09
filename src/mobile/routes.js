import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import * as Home from '#/mobile/containers/Home';
import * as Base from '#/mobile/containers/Base';

export default(
  <Route component={Base.default}>
    <Route path="/" component={Home.default}>
      <IndexRoute component={Picks.default} asyncEnter={Picks.asyncEnter} reducer={Picks.reducer}/>
    </Route>
  </Route>
)
