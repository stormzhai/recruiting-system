#!/usr/bin/env bash

# api package
set -e
rm -fr assembly/assemble/jetty-api/*
cp -r api/* assembly/assemble/jetty-api

cp assembly/conf/config.properties assembly/assemble/jetty-api/src/main/resources/config.properties
cp assembly/conf/gradle.properties assembly/assemble/jetty-api/gradle.properties

cd assembly/assemble/jetty-api
./gradlew clean
./gradlew war
cd -

cp assembly/assemble/jetty-api/build/libs/jetty-api.war assembly/assemble/jetty-api.war

# app package
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
cd assembly/assemble
# zip -qr node-app.zip node-app
cd -

# task queue package
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
# zip -qr task-queue.zip task-queue
cd -
