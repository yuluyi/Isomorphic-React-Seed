#!/bin/bash -e

# 文件绝对路径
DIR=$(cd `dirname $0`;pwd)

# 引入工具库
source $DIR/utils.sh

check webpack babel

npm run build
npm run upload
ssh user@your_ssh <<-'ENDSSH'
  rm -rf ~/dirToOldStaticFolder
ENDSSH
scp -r -C ./app.json ./package.json ./dist/server.js ./dist/desktop.manifest.json ./dist/mobile.manifest.json  ./dist/static/ user@your_ssh:~/dirToYourProjectFolder
ssh user@your_ssh <<-'ENDSSH'
  cd ~/dirToYourProjectFolder
  npm install --production
  pm2 stop YourWebApp
  pm2 delete YourWebApp
  pm2 start ~/dirToYourProjectFolder/app.json --env production
ENDSSH
echo 'Remote deploy succeeded'
