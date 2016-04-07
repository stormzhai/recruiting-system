#!/usr/bin/env bash

set -eo pipefail

if [ -z "$CONFIG_FILE_DIR" ]; then
	echo >&2 'You need to specify CONFIG_FILE_DIR'
	exit 1
fi

# api package
rm -fr assembly/assemble/jetty-api/*
cp $CONFIG_FILE_DIR/config.properties api/src/main/resources/config.properties

cd api
gradle clean
gradle war
cd -

cp api/build/libs/api.war assembly/assemble/jetty-api.war

# web
rm -fr web/public/
cd web
npm install
./node_modules/.bin/webpack
cd -
cp -r web/public/assets assembly/.release
cd assembly/.release
zip -qr web.zip assets
rm -fr assets
cd -

# task-queue
cd task-queue
npm install
cd -

# 删除文件
rm -fr assembly/assemble/task-queue/*
# 将文件拷贝到目标地址
cp -r task-queue/* assembly/assemble/task-queue

# 写入配置文件
cp assembly/conf/task-queue-config.yml assembly/assemble/task-queue/config/config.yml
# 压缩
cd assembly/assemble
zip -qr task-queue.zip task-queue
cd -
