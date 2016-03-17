#!/usr/bin/env bash

docker exec -it assembly_mysql_1 /tmp/create-db.sh
docker exec -it assembly_node-app_1 bash -c 'cd /var/app && node tools/seeds/refresh.js'