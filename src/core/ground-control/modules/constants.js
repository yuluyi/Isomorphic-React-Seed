export const IS_CLIENT = typeof window !== 'undefined';
export const IS_SERVER = !IS_CLIENT;
export const REHYDRATE_REDUCERS = '@@groundcontrol/REHYDRATE_REDUCERS';
export const HYDRATE_STORE = '@@groundcontrol/HYDRATE_STORE';
export const UPDATE_ROUTE_STATE = '@@groundcontrol/UPDATE_ROUTE_STATE';
export const NAMESPACE = 'groundcontrol';
export const CHILD = 'child';
export const SELF = 'self';
export const META = 'meta';
export const FD_DONE = 'done';
export const FD_CLIENT_RENDER = 'client';
export const FD_SERVER_RENDER = 'server';
export const ROOT_DEPTH = 0;
