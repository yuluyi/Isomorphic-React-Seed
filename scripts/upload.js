"use strict"

var hugoUpload = require('hugo-upload');

module.exports = () => {
  let uploadDirs = ['dist/assets'];

  hugoUpload.config({
    // qiniu key
    accessKey: 'xxxxxxx',
    secretKey: 'xxxxxxx',

    // log file
    // relative to `process.cwd()`
    log: 'dist/qiniu.log',

    rewrite: ['dist/assets', 'cdn-prefix/assets']

    // prefix
    //prefix: 'backend/'
  });

  for(let value of uploadDirs) {
    hugoUpload.upload(value);
  }
}
