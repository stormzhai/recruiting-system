#!/usr/bin/env bash

set -eo pipefail

JENKINS_ADDR=192.168.99.100:8088

function logo() {
  echo -e "\033[35m"
  cat assembly/logo
  echo -e "\033[0m"
}

function updateApi() {
  dir=$1;

  if [[ -d $dir ]]; then
    cd $dir
    ./gradlew flywaymigrate
    ./gradlew war
    cd -
  fi
}

function updateNodeApp() {
  dir=$1;
  shift;
  if [[ -d $dir ]]; then
    cd $dir
    if [[ $# -gt 0 ]]; then
      $@
    else
      npm install
    fi
    cd -
  fi
}

function initAllService() {
  git submodule init
  git submodule update

  updateApi "paper-api";
  updateNodeApp "web-api";
  updateNodeApp "task-queue";
  updateNodeApp "web";
  updateNodeApp "web" ./node_modules/.bin/webpack;

  eval $(docker-machine env default)
  docker-compose -f assembly/docker-compose.yml kill
  docker-compose -f assembly/docker-compose.yml up -d
}

function initializeJenkins() {
  docker exec -it assembly_jenkins_1 mkdir -p /var/jenkins_home/jobs/TASK-RUNNER
  docker exec -it assembly_jenkins_1 cp /tmp/data/config.xml /var/jenkins_home/jobs/TASK-RUNNER
  curl -XPOST http://$JENKINS_ADDR/pluginManager/installNecessaryPlugins -d '<install plugin="git@current" />'
  curl -XPOST http://$JENKINS_ADDR/pluginManager/installNecessaryPlugins -d '<install plugin="EnvInject@current" />'
  curl -XPOST http://$JENKINS_ADDR/pluginManager/installNecessaryPlugins -d '<install plugin="flexible-publish@current" />'
  curl -XPOST http://$JENKINS_ADDR/pluginManager/installNecessaryPlugins -d '<install plugin="PostBuildScript@current" />'
}

function initMysql() {
  echo "the password of root:"
  sql=$(cat mysql-init.sql)
  read -s password
  docker exec -it assembly_mysql_1 mysql -u root -p$password -e "$sql"
}

action=$1

case $action in
  jk)
    initializeJenkins;
    echo "jenkins启动过程缓慢,此过程可能需要一定时间"
    echo "请查看 http://$JENKINS_ADDR/updateCenter/"
    ;;
  rs)
    initAllService;
    ;;
  my)
    initMysql;
    ;;
  *)
    logo
    echo "用法：在项目根目录执行assmebly/twars.sh <commadn>"
    echo "- command："
    echo "jk 初始化jenkins"
    echo "my 初始化数据库和用户"
    echo "rs 重启所有服务"
    echo ""
    ;;
esac
