#!/usr/bin/env bash
set -e

# 准备代码
cd task-queue
npm install
cd -

# 删除文件
rm -fr assembly/assemble/task-queue/*
# 将文件拷贝到目标地址
cp -r task-queue/* assembly/assemble/task-queue

# 写入配置文件
cp assembly/conf/task-queue-config.yml assembly/assemble/task-queue/config/config.yml

