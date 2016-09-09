import ip from 'ip';

const ips = [
  // 'Baiduspider'
    '202.108.11.0/24',
    '220.181.32.0/24',
    '58.51.95.0/24',
    '60.28.22.0/24',
    '61.135.162.0/24',
    '61.135.163.0/24',
    '61.135.168.0/24',
  // 'YodaoBot'
    '202.108.7.215/32',
    '202.108.7.220/32',
    '202.108.7.221/32',
  // 'SogouWebSpider'
    '219.234.81.0/24',
    '220.181.61.0/24',
  // 'Googlebot'
    '203.208.60.0/24',
  // 'Yahoo!Slurp'
    '202.160.181.0/24',
    '72.30.215.0/24',
    '74.6.17.0/24',
    '74.6.22.0/24',
  // 'YahooContentMatchCrawler'
    '119.42.226.0/24',
    '119.42.230.0/24',
  // 'Sogou-Test-Spider'
    '220.181.19.103/32',
    '220.181.26.122/32',
  // 'Twiceler'
    '38.99.44.104/32',
    '64.34.251.9/32',
  // 'Yahoo!SlurpChina'
    '202.160.178.0/24',
  // 'Sosospider'
    '124.115.0.0/24',
  // 'CollapsarWEBqihoobot'
    '221.194.136.18/32',
  // 'NaverBot'
    '202.179.180.45/32',
  // 'SogouOrionSpider'
    '220.181.19.106/32',
    '220.181.19.74/32',
  // 'SogouHeadSpider'
    '220.181.19.107/32',
  // 'SurveyBot'
    '216.145.5.42/32',
    '64.246.165.160/32',
  // 'YangaWorldSearchBotV'
    '77.91.224.19/32',
    '91.205.124.19/32',
  // 'BaiduSpiderMobileGate'
    '220.181.5.34/32',
    '61.135.166.31/32',
  // 'discobot'
    '208.96.54.70/32',
  // 'iaArchiver'
    '209.234.171.42/32',
  // 'MSNBot'
    '65.55.104.209/32',
    '65.55.209.86/32',
    '65.55.209.96/32',
  // 'SogouInSpider'
    '220.181.19.216/32'
];

export default class is {
  constructor(useragent, ip) {
    this.useragent = useragent
    this.requestIP = ip
  }
  mobile() {
    return /mqq|Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(this.useragent);
  }
  tablet() {
    return /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(this.useragent);
  }
  wechat() {
    return /micromessenger/i.test(this.useragent);
  }
  iOS() {
    return /iP(hone|od|ad)|iOS/i.test(this.useragent);
  }
  Android() {
    return /Android/i.test(this.useragent);
  }
  searchEngine() {
    if(/Baiduspider|Googlebot|Feedfetcher-Google|Yahoo|iaskspider|YodaoBot|msnbot|Sogou.*(spider|blog)|JikeSpider|Sosospider|360Spider/i.test(this.useragent)) return true;
    if(/ZhihuDailyTranscoder|ZhihuExternalHit|QQ-URL-Manager|GCanvas|Trident\/5/i.test(this.useragent)) return true;
    if(ips.some(e => ip.cidrSubnet(e).contains(this.requestIP))) return true;
    return false;
  }
}
