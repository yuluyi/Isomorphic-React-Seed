import { FD_DONE, UPDATE_ROUTE_STATE, FD_SERVER_RENDER, FD_CLIENT_RENDER } from './constants';
import { getNestedStateAndMeta } from './nestedState';
import deepEqual from 'deep-equal';

export default (store, depth, type, loadingError = false) => {
  const { meta: currentMeta } = getNestedStateAndMeta(store.getState(), depth);
  let meta = { ...currentMeta, blockRender: currentMeta.blockRender && type !== FD_SERVER_RENDER && type !== FD_CLIENT_RENDER };
  if (loadingError) meta = { ...meta, loadingError };
  if (type === FD_DONE) meta = { ...meta, loading: false };
  if (!deepEqual(currentMeta, meta)) store.dispatch({ type: UPDATE_ROUTE_STATE, meta, depth });
};
