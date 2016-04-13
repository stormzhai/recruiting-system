#!/usr/bin/env bash

JENKINS_ADDR=192.168.99.100:8088

function initAllService() {
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

function migrateMysql() {
  cd paper-api
  gradle flywaymigrate
  cd -
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
  mi)
    migrateMysql;
    ;;
  *)
    echo "jk 初始化jenkins"
    echo "rs 重启所有服务"
    echo "my 初始化数据库和用户"
    echo "mi 数据库迁移"
    ;;
esac
