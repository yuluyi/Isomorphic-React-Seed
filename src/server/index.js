import koa from "koa";
import koaProxy from "koa-proxy";
// import koaStatic from "koa-static";
import React from "react";
import ReactDOM from "react-dom/server";
import * as ReactRouter from "react-router";
import {createNamespace, destroyNamespace} from 'continuation-local-storage';
import Provider from '#/utils/ContextProvider';

import {renderToString} from 'react-dom/server';
import GroundControl, {loadStateOnServer} from '#/core/ground-control';
import Is from '#/utils/is';
import createStore from '#/createStore';
import fs from 'fs';
import path from 'path';
// import koaSend from 'koa-send';
import compress from 'koa-compress';
import conditional from 'koa-conditional-get';
import koaAddTrailingSlashes from 'koa-add-trailing-slashes';
import koaStatic from 'koa-static';
import {stat as fileStat} from 'mz/fs';
import html from './html';

let desktopManifest, mobileManifest, desktopConfig, mobileConfig;
try {
  desktopManifest = require('./desktop.manifest.json');
  mobileManifest = require('./mobile.manifest.json');
  desktopConfig = {
    main: desktopManifest['main.js'],
    vendor: desktopManifest['vendor.js'],
    webpack: desktopManifest['webpack.js']
  };

  mobileConfig = {
    main: mobileManifest['main.js'],
    vendor: mobileManifest['vendor.js'],
    webpack: mobileManifest['webpack.js']
  };
} catch(err) {
  desktopConfig = {
    main: 'desktop.main.js?date=' + Date.now(),
    vendor: 'desktop.vendor.js',
    webpack: 'desktop.webpack.js'
  };
  mobileConfig = {
    main: 'mobile.main.js?date=' + Date.now(),
    vendor: 'mobile.vendor.js',
    webpack: 'mobile.webpack.js'
  };
}


const publicPath = __PRODUCTION__ ? `//xxx.xxx.com/assets/` : '/dist/assets/';


try {
  const app = koa();
  const hostname = process.env.HOSTNAME || "localhost";
  const port = process.env.PORT || 4000;
  let routes = require('#/routes').default;

  // 带etag直接返回304
  app.use(conditional());

  //gzip
  app.use(compress());

  // 末尾不带/且有对应目录的话，跳转到带/的地址
  app.use(koaAddTrailingSlashes());

  app.use(koaStatic(__dirname + '/static', {defer: false}));

  // 末尾不带/且有对应目录的话，跳转到带/的地址
  // app.use(function * (next) {
  //   if (this.method == 'HEAD' || this.method == 'GET') {
  //     const root = path.join(__dirname, './static');
  //     if(!this.path.endsWith('/')) {
  //       try {
  //         const absPath = path.join(root, this.path);
  //         const stat = yield fileStat(absPath);
  //         if(stat.isDirectory()) {
  //           this.status = 303;
  //           this.redirect(this.path + '/');
  //           return;
  //         }
  //       } catch(err) {}
  //     }
  //     const opts = {
  //       root,
  //       index: 'index.html'
  //     }
  //     if (yield koaSend(this, this.path, opts)) return;
  //   }
  //   yield* next;
  // });


  const ls = createNamespace('ls');

  app.use(function * (next) {
    const is = new Is(this.request.headers['user-agent'], this.request.ip);
    const appPath = publicPath + (is.mobile() ? mobileConfig.main : desktopConfig.main);
    const vendorPath = publicPath + (is.mobile() ? mobileConfig.vendor : desktopConfig.vendor);
    const webpackPath = publicPath + (is.mobile() ? mobileConfig.webpack : desktopConfig.webpack);
    const data = {
      css: [],
      title: 'title',
      meta: {},
      appScript: `<script type="text/javascript" src="${appPath}"></script>`,
      vendorScript: vendorPath ? `<script type="text/javascript" src="${vendorPath}"></script>` : '',
      webpackScript: webpackPath ? `<script type="text/javascript" src="${webpackPath}"></script>` : '',
      scriptString: '',
      jsSDK: is.wechat()
        ? `<script src="https://res.wx.qq.com/open/js/jweixin-1.1.0.js"></script>`
        : '',
      body: '',
      mobileConsole: (__DEV__ || process.env.__TEST__) && is.mobile() ? '<script src="//assets.dtcj.com/static/eruda/0.5.7/eruda.min.js"></script><script>eruda.init()</script>' :''
    };
    if(is.searchEngine()) {
      // if is searchEngine, server render
      yield(callback => {
        ReactRouter.match({
          routes: is.mobile() ? routes.mobile : routes.desktop,
          location: this.path
        }, (routingErr, redirectLocation, props) => {
          if (routingErr) {
            this.status = 500;
            this.body = routingErr.message;
            callback(routingErr.message);
            return;
          } else if (redirectLocation) {
            this.redirect(redirectLocation.pathname + redirectLocation.search, "/");
            return;
          } else if (props) {
            const {store, reducers} = createStore({
              enableReactRouterRedux: true,
              // enableLoop: true,
              enableThunk: true,
              history: ReactRouter.browserHistory
              // additionalReducers: is.mobile() ? require('#/mobile/store/reducers') : require('#/desktop/store/reducers')
            });
            let serverOpts = {
              props,
              store,
              reducers
            };
            ls.run(() => {
              // Set per request global variables
              ls.set('authToken', this.request.headers['http-authtoken'] || this.cookies.get('authToken'));
              ls.set('userAgent', this.request.headers['user-agent']);
              ls.set('setTitle', title => data.title = title);
              ls.set('setMeta', (name, content) => data.meta[name] = content);
              loadStateOnServer(serverOpts, (
                loadDataErr,
                loadDataRedirectLocation,
                initialData,
                scriptString
              ) => {
                if (loadDataErr) {
                  this.status = 500;
                  this.body = loadDataErr.message;
                  ls.set('authToken', null);
                  ls.set('userAgent', null);
                  ls.set('setTitle', null);
                  ls.set('setMeta', null)
                  callback(loadDataErr.message);
                  return;
                } else if (loadDataRedirectLocation) {
                  this.redirect(`${loadDataRedirectLocation.pathname}${loadDataRedirectLocation.search}`, "/");
                  ls.set('authToken', null);
                  ls.set('userAgent', null);
                  ls.set('setTitle', null);
                  ls.set('setMeta', null)
                  return;
                } else {
                  this.status = 200;

                  try {
                    data.scriptString = scriptString;
                    data.body = renderToString(
                        <Provider
                          store={store}
                          insertCss={styles => data.css.push(styles._getCss())}
                        >
                          <GroundControl {...props} reducers={reducers} store={store} initialData={initialData}/>
                        </Provider>
                      );
                  } catch (err) {
                    console.error(err.stack || err);
                  }
                  this.body = html(data);
                  ls.set('authToken', null);
                  ls.set('userAgent', null);
                  ls.set('setTitle', null);
                  ls.set('setMeta', null)
                  callback(null);
                  return;
                }
              });
            });
          } else {
            this.status = 404;

            callback(404);
            return;
          }
        });
      });
    } else {
      // if not server render, just send static html
      this.status = 200;
      this.set('etag', is.mobile() ? mobileConfig.main : desktopConfig.main);
      // data.css.push(CLIENT_RENDER_CSS);
      this.body = html(data);
    }
  });
  app.listen(port, () => {
    console.info("==> ✅  Server is listening");
    console.info("==> 🌎  Go to http://%s:%s", hostname, port);
  });

  if (__DEV__) {
    if (module.hot) {
      console.log("[HMR] Waiting for server-side updates");

      module.hot.accept("#/routes", () => {
        routes = require("#/routes").default;
      });

      module.hot.addStatusHandler((status) => {
        if (status === "abort") {
          setTimeout(() => process.exit(0), 0);
        }
      });
    }
  }
} catch (error) {
  console.error(error.stack || error);
}
