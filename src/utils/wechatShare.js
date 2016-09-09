export default (shareInfo) => {
  if (typeof window === 'undefined') return;
  if (typeof wx === 'undefined') return;
  const defaultInfo = {
    title: 'title',
    desc: 'desc',
    imgUrl: 'imgUrl',
    link: typeof window !== 'undefined' ? location.href.split('#')[0] : ''
  }
  const wxData = Object.assign({}, defaultInfo, shareInfo);
  wx.onMenuShareTimeline(wxData);
  wx.onMenuShareAppMessage(wxData);
  wx.onMenuShareQQ(wxData);
  wx.onMenuShareWeibo(wxData);
  wx.onMenuShareQZone(wxData);
}
