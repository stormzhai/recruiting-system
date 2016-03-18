#!/usr/bin/env bash

# api package
set -e
rm -fr assembly/assemble/jetty-api/*
cp assembly/conf/config.properties api/src/main/resources/config.properties
cp assembly/conf/gradle.properties api/gradle.properties

cd api
./gradlew clean
./gradlew war
cd -

cp api/build/libs/api.war assembly/assemble/jetty-api.war


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

zip -r assembly/assemble/nodeapp.zip assembly/assemble/node-app

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
zip -r assembly/assemble/task-queue.zip assembly/assemble/task-queue