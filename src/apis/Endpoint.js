import fetch from 'isomorphic-fetch';
import urlJoin from 'url-join';
import storage from '#/utils/storage';
import pickBy from 'lodash/pickBy';


export default class Endpoint {
  constructor({
    root = __CLIENT__
    ? `${location.protocol}//${location.hostname}${location.port ? ':' + location.port : ''}`
    : (process.env.WEBSITE_HOSTNAME
      ? `http://${process.env.WEBSITE_HOSTNAME}`
      : `http://127.0.0.1`),
    path = '/',
    headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Http-Authorization': __CLIENT__ ? storage('authToken') : require('continuation-local-storage').getNamespace('ls').get('authToken')
    }
  } = {}) {
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Http-Authorization': __CLIENT__ ? storage('authToken') : require('continuation-local-storage').getNamespace('ls').get('authToken')
    };
    this.root = root;
    this.path = path;
    this.url = urlJoin(root, path);
    this.headers = Object.assign({}, defaultHeaders, headers);
  }

  resource(id) {
    return new Endpoint({
      root: this.root,
      headers: this.headers,
      path: urlJoin(this.path, id)
    });
  }

  browse({query, body, headers} = {}) {
    return _get({
      url: urlJoin(this.url, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

  read({id, query, body, headers} = {}) {
    return _get({
      url: urlJoin(this.url, id, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

  edit({id, query, body, headers} = {}) {
    return _put({
      url: urlJoin(this.url, id, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

  add({id, query, body, headers} = {}) {
    return _post({
      url: urlJoin(this.url, id, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

  delete({id, query, body, headers} = {}) {
    return _delete({
      url: urlJoin(this.url, id, handleQuery(query)),
      headers: Object.assign({}, this.headers, headers),
      body
    });
  }

}

Endpoint.prototype.list = Endpoint.prototype.browse;
Endpoint.prototype.retrieve = Endpoint.prototype.read;
Endpoint.prototype.create = Endpoint.prototype.add;
Endpoint.prototype.destroy = Endpoint.prototype.delete;
Endpoint.prototype.modify = Endpoint.prototype.edit;

function handleQuery(query) {
  if(!query) return '';
  return '?' + Object.entries(query).map(entry => encodeURIComponent(entry[0]) + '=' + encodeURIComponent(entry[1])).join('&');
}

function _request(url, options) {
  let finalOptions;
  if(typeof options.body !== 'string') finalOptions = Object.assign({}, options, {body: JSON.stringify(options.body)});
  finalOptions.headers = pickBy(finalOptions.headers);
  return fetch(url, pickBy(finalOptions))
  .then(handleResponse)
  .catch(handleBadResponse);
}


//TODO: 以后直接返回res， 数据提取交给调用的函数
function handleResponse(res) {
  if (res.status === 204)
    return {res: {}};
  if (res.status >= 200 && res.status < 300)
    return res.json().then(res => ({res}));
  else
    return Promise.reject(res);
}

function handleBadResponse(res) {
  try {
    return res.json().then(data => ({
      err: Object.assign({status: res.status}, data),
      res: {},
    }));
  } catch(err) {
    return {
      err: res,
      res: {},
    }
  }
}

function _get({url, headers, body}) {
  return _request(url, {
    method: 'get',
    headers,
    body
  });
}

function _post({url, headers, body}) {
  return _request(url, {
    method: 'post',
    headers,
    body
  });
}

function _put({url, headers, body}) {
  return _request(url, {
    method: 'put',
    headers,
    body
  });
}

function _delete({url, headers, body}) {
  return _request(url, {
    method: 'delete',
    headers,
    body
  });
}
