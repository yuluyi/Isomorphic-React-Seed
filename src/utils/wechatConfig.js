import {wechatSignature} from '#/apis';

export default () => {
  if(typeof window === 'undefined' || typeof wx === 'undefined') return Promise.resolve();
  return wechatSignature().browse({
    query: {
      url: window.location.href.split('#')[0]
    }
  }).then(({res, err}) => wx.config({
      debug: false,
      appId: 'xxxxxxxx',
      timestamp: res.timestamp,
      nonceStr: res.noncestr,
      signature: res.signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
      ]
    }));
}
