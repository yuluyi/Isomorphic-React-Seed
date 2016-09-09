const CLIENT_RENDER_CSS =
`
body {
  overflow: scroll;
  font-family: -apple-system, "PingFang SC", Helvetica, Roboto, "Microsoft YaHei", "微软雅黑", Microsoft Sans Serif, Hiragino Sans GB, Source Han Sans, WenQuanYi Micro Hei, sans-serif, "黑体";
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  text-rendering: optimizelegibility;
  background-color: #F4F4F4;
}
.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  font-size: 14px;
  color: #999;
  line-height: 50px;
  text-align: center;
}
.UFO {
  width: 141px;
  height: 73px;
  background: url(/UFO.png) no-repeat;
  background-size: contain;
  -webkit-background-size: contain;
}
.light {
  width: 60px;
  height: 100px;
  margin: 0 auto;
  background: url(/light.png) no-repeat;
  background-size: contain;
  -webkit-background-size: contain;
  animation: switch 3s ease-in-out infinite;
  -webkit-animation: switch 3s ease-in-out infinite;
  -o-animation: switch 3s ease-in-out infinite;
}
.D-sir {
  position: absolute;
  right: 53px;
  bottom: 120px;
  width: 34px;
  height: 37px;
  background: url(/D.png) no-repeat;
  background-size: contain;
  -webkit-background-size: contain;
  animation: float 3s ease-in-out infinite;
  -webkit-animation: float 3s ease-in-out infinite;
  -o-animation: float 3s ease-in-out infinite;
}
@-webkit-keyframes switch {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes switch {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes switch {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes float {
  0% {
    -webkit-transform: translate(0, 0) scale(0);
    transform: translate(0, 0) scale(0);
  }
  15% {
    -webkit-transform: translate(0, 0) scale(0);
    transform: translate(0, 0) scale(0);
  }
  50% {
    -webkit-transform: translate(0, 65px) scale(1);
    transform: translate(0, 65px) scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: translate(53px, 65px) scale(1);
    transform: translate(53px, 65px) scale(1);
  }
}
@-o-keyframes float {
  0% {
    -webkit-transform: translate(0, 0) scale(0);
    -o-transform: translate(0, 0) scale(0);
    transform: translate(0, 0) scale(0);
  }
  15% {
    -webkit-transform: translate(0, 0) scale(0);
    -o-transform: translate(0, 0) scale(0);
    transform: translate(0, 0) scale(0);
  }
  50% {
    -webkit-transform: translate(0, 65px) scale(1);
    -o-transform: translate(0, 65px) scale(1);
    transform: translate(0, 65px) scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: translate(53px, 65px) scale(1);
    -o-transform: translate(53px, 65px) scale(1);
    transform: translate(53px, 65px) scale(1);
  }
}
@keyframes float {
  0% {
    -webkit-transform: translate(0, 0) scale(0);
    -o-transform: translate(0, 0) scale(0);
    transform: translate(0, 0) scale(0);
  }
  15% {
    -webkit-transform: translate(0, 0) scale(0);
    -o-transform: translate(0, 0) scale(0);
    transform: translate(0, 0) scale(0);
  }
  50% {
    -webkit-transform: translate(0, 65px) scale(1);
    -o-transform: translate(0, 65px) scale(1);
    transform: translate(0, 65px) scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: translate(53px, 65px) scale(1);
    -o-transform: translate(53px, 65px) scale(1);
    transform: translate(53px, 65px) scale(1);
  }
}`;

    const CLIENT_RENDER_BODY =
`<div class="loading">
  <div class="UFO"></div>
  <div class="light"></div>
  <div class="D-sir"></div>
  <div>加载中...</div>
</div>
`;


export default function html(data) {
  return (
`<!doctype html>
<html class="no-js" lang="">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
  <meta name="wap-font-scale" content="no">
  <meta name="renderer" content="webkit">
  <title>${data.title}</title>
  ${Object.keys(data.meta).map(key => `<meta name="${key}" content="${data.meta[key]}">`).join('\n')}
  <style type="text/css">${data.css.join('') || CLIENT_RENDER_CSS}</style>
  <link href="//assets.dtcj.com/static/font-awesome/4.5.0/css/font-awesome.min.css" rel="stylesheet">
</head>

<body>
  <div id="app">${data.body || CLIENT_RENDER_BODY}</div>
  ${data.jsSDK}
  ${data.scriptString}
  ${data.adScript}
  ${data.mobileConsole}
  ${data.webpackScript}
  ${data.vendorScript}
  ${data.appScript}
  ${ANALYTIC_CODES}
</body>

</html>`
  )
}
