/** @flow */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import measure from '#/utils/measure';
// import shallowCompare from 'react-addons-shallow-compare'

/**
 * Higher-order component that manages lazy-loading for "infinite" data.
 * This component decorates a virtual component and just-in-time prefetches rows as a user scrolls.
 * It is intended as a convenience component; fork it if you'd like finer-grained control over data-loading.
 */
export default class InfiniteLoader extends Component {
  static propTypes = {
    /**
     * Function respondible for rendering a list item component.
     * This function should implement the following signature:
     * (data) => PropTypes.element
     */
    children: PropTypes.func.isRequired,

    /**
     * Initial data used to render the initial list
     */
    data: PropTypes.array.isRequired,

    /**
     * Callback to be invoked when more data must be loaded.
     * It should implement the following signature: (data: Object): Promise
     */
    loadMoreData: PropTypes.func.isRequired,

    /**
     * A stateless component which indicates the loading status
     * It accepts one props: fetching, to indicate the current status
     */
    renderLoadingItem: PropTypes.func,

    /**
     * A stateless component, on click which will load more data
     * It accepts one props: fetching, to indicate the current status
     * ! If present, the infinite scroll feature will be disabled
     */
    renderLoadButton: PropTypes.func,
    /**
     * Threshold at which to pre-fetch data.
     * A threshold X means the ratio of the already visited content to the whote content
     * This value defaults to 0.2
     */
    threshold: PropTypes.number,

    useWindowAsScrollContainer: PropTypes.bool,

    className: PropTypes.string
  }

  static defaultProps = {
    threshold: 0.2,
    className: 'infinite-list',
    useWindowAsScrollContainer: false
  }

  constructor (props, context) {
    super(props, context);
    this.handleScroll = ::this.handleScroll;
    this.state = {};
  }

  componentDidMount() {
    if(!this.props.renderLoadButton) {
      this.scrollContainer = this.props.useWindowAsScrollContainer ? window : ReactDOM.findDOMNode(this);
      this.attachScrollListener();
    }
  }

  componentWillUnmount() {
    if(!this.props.renderLoadButton) {
      this.detachScrollListener();
    }
  }

  attachScrollListener() {
    this.scrollContainer.addEventListener('scroll', this.handleScroll, false);
    this.scrollContainer.addEventListener('resize', this.handleScroll, false);
    this.handleScroll();
  }

  detachScrollListener() {
    this.scrollContainer.removeEventListener('scroll', this.handleScroll, false);
    this.scrollContainer.removeEventListener('remove', this.handleScroll, false);
  }

  fetchMore() {
    if(this.state.fetching) return;
    if(this.state.noMore) return;
    this.setState({fetching: true});
    return this.props.loadMoreData()
    .then(res => {
      const ret = {fetching: false};
      if (res && res.noMore) ret.noMore = true;
      this.setState(ret);
    }).catch(err => {
      this.fetchMore();
    });
  }

  handleScroll() {
    const dimension = measure(this.scrollContainer);
    const scrollTop = dimension.scrollTop();
    const height = dimension.height();
    const scrollHeight = dimension.scrollHeight() < height ? height : dimension.scrollHeight();
    const ratio = 1- (scrollTop + height) / scrollHeight;
    if(!this.state.noMore && !this.state.fetching && ratio <= this.props.threshold) {
      this.fetchMore().then(() => dimension.height() >= dimension.scrollHeight() && this.handleScroll());
    }
  }

  render() {
    const Children = this.props.children;
    const LoadingItem = this.props.renderLoadingItem;
    const LoadButton = this.props.renderLoadButton;
    const NodeList = this.props.data.map((dataItem, index) => <Children key={index} {...dataItem} />)
    return (
      <ul className={this.props.className}>
        {NodeList}
        {
          LoadingItem
          ? <LoadingItem {...this.state}/>
          : LoadButton
            ? <LoadButton {...this.state} fetchMore={::this.fetchMore} />
            : null
        }
      </ul>
    )
  }
}
