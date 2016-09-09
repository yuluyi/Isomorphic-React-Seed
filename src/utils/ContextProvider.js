import React, {Component, PropTypes, Children} from 'react';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';

export default props => {
  class Provider extends Component {
    static childContextTypes = Object.keys(props).reduce((prev, cur) => {
      if(cur === 'children') return prev;
      return isFunction(props[cur]) ? (prev[cur] = PropTypes.func, prev) : (prev[cur] = PropTypes.object, prev);
    }, {});

    getChildContext() {
      return omit(props, 'children');
    }

    render() {
      const {children} = props;
      return Children.only(children);
    }
  }
  return <Provider />
}
