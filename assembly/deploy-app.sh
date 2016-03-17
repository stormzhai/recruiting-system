#!/usr/bin/env bash
set -e

# 准备代码
cd app
npm install
./node_modules/.bin/webpack
cd -

# 删除文件
rm -fr assembly/assemble/node-app/*

# 写入文件
cp -r app/* assembly/assemble/node-app

# 写入配置文件
cp assembly/conf/app-config.yml assembly/assemble/node-app/config/config.yml
