#!/usr/bin/env bash
LOGFILE=jenkins.log
HTTP_PORT=8888

nohup java -jar jenkins.war --httpPort=$HTTP_PORT > $LOGFILE 2>&1 &