import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

export default
class Modal extends Component {
  static defaultProps = {
    className: 'modal',
    backdropClassName: 'backdrop',
    containerClassName: 'container',
    containerDOMId: 'app'
  }
  static contextTypes = {
    router: PropTypes.object
  }
  constructor() {
    super();
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    this.listDOM = document.createElement('div');
    document.querySelector(`#${this.props.containerDOMId}`).appendChild(this.listDOM);
    this.modalReactElement =
      <div className={this.props.backdropClassName} onClick={::this.close} data-show={this.state.show}>
        <div className={this.props.containerClassName} onClick={e => e.stopPropagation()}>{this.props.children}</div>
      </div>;
    this.listInstance = ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      this.modalReactElement,
      this.listDOM);
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.listDOM);
    this.listInstance = null;
    document.querySelector(`#${this.props.containerDOMId}`).removeChild(this.listDOM);
    this.listDOM = null;
    this.modalReactElement = null;
  }

  onClickSelf() {
    this.state.show ? this.props.onClose && this.props.onClose() : this.props.onOpen && this.props.onOpen();
    this.setState({
      show: !this.state.show
    });
  }

  close() {
    this.props.onClose && this.props.onClose();
    this.setState({
      show: false
    });
  }

  componentDidUpdate() {
    this.modalReactElement =
      <div className={this.props.backdropClassName} onClick={::this.close} data-show={this.state.show}>
        <div className={this.props.containerClassName} onClick={e => e.stopPropagation()}>{this.props.children}</div>
      </div>;
    this.listInstance = ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      this.modalReactElement,
      this.listDOM);
  }

  render() {
    return (
      <div className={this.props.className} onClick={::this.onClickSelf} >
        {this.props.name}
      </div>
    )
  }
}
