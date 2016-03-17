#!/usr/bin/env bash

set -e
WORKDIRECTORY=$1
rm -fr $WORKDIRECTORY/assembly/assemble/jetty-api/*
cp $WORKDIRECTORY/assembly/conf/config.properties $WORKDIRECTORY/api/src/main/resources/config.properties
cp $WORKDIRECTORY/assembly/conf/gradle.properties $WORKDIRECTORY/api/gradle.properties

cd $WORKDIRECTORY/api
gradle clean
gradle war
cd -

cp $WORKDIRECTORY/api/build/libs/api.war $WORKDIRECTORY/assembly/assemble/jetty-api/jetty-api.war