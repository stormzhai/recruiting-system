#!/bin/sh

[ -e /data/db/mongod.lock ] && rm /data/db/mongod.lock
mongod --dbpath=/data/db --fork --logpath=/var/log/mongodb.log