#!/bin/bash
set -e

if [ "bash" == $@ ]; then
	echo $@
fi

cd /etc/nginx/conf.d
mv default.conf default.conf.bak

service nginx start
cd $JETTY_HOME
java -jar start.jar

exec "$@"
