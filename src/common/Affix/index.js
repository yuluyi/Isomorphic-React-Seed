import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import measure from '#/utils/measure';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import classNames from 'classnames';

class Affix extends Component {
  static defaultProps = {
    className: 'affix',
    fixClassName: 'fix',
    placeholderClassName: 'placeholder',
    scrollContainer: canUseDOM ? window : null,
    fromBottom: false
  }
  constructor() {
    super();
    this.state = {
      affix: false
    }
    this.handleScroll = ::this.handleScroll;
  }
  handleScroll() {
    const dimension = measure(this.refs.affix);
    if(this.state.affix && window.pageYOffset + this.props.marginTop <= this.offsetTop + this.props.fromBottom * dimension.height()) {
      this.setState({
        affix: false
      });
    } else if(!this.state.affix && window.pageYOffset + this.props.marginTop > this.offsetTop + this.props.fromBottom * dimension.height()) {
      this.setState({
        affix: true
      });
    }
  }
  componentDidMount() {
    if(this.props.disable) return;
    this.offsetTop = measure(this.refs.placeholder).offset().top;
    window.addEventListener('touchmove', this.handleScroll);
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  }

  recalibrate() {
    this.offsetTop = measure(this.refs.placeholder).offset().top;
  }
  componentWillUnmount() {
    if(this.props.disable) return;
    window.removeEventListener('touchmove', this.handleScroll);
    window.removeEventListener('scroll', this.handleScroll);
  }
  render() {
    return (
      <div
        ref="placeholder"
        className={this.props.placeholderClassName}
        style={this.state.affix ? {
          width: measure(this.refs.placeholder).width(),
          height: measure(this.refs.placeholder).height()
        } : null}>
        <div
          ref="affix"
          className={classNames({
            [this.props.className]: true,
            [this.props.fixClassName]: this.state.affix
          })}
          style={this.state.affix ? {
              position: 'fixed',
              left: this.refs.affix.getBoundingClientRect().left,
              top: this.props.marginTop,
              width: this.refs.affix.getBoundingClientRect().width
            } : null }>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Affix;
