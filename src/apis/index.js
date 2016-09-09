import Endpoint from './Endpoint';

export const wechatSignature = () => new Endpoint({
  root: __CLIENT__
  ? `${location.protocol}//${location.hostname}${location.port ? ':' + location.port : ''}/wechat`
  : (process.env.WEBSITE_HOSTNAME
    ? `http://${process.env.WEBSITE_HOSTNAME}/wechat`
    : `http://127.0.0.1:5678/wechat`),
  path: '/signature'
});

// user
export const user = () => new Endpoint({path: '/api/user'});
