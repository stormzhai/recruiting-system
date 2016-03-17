#!/usr/bin/env bash

set -e
rm -fr $WORKDIRECTORY/assembly/assemble/jetty-api/*
cp $WORKDIRECTORY/assembly/conf/config.properties $WORKDIRECTORY/api/src/main/resources/config.properties
cp $WORKDIRECTORY/assembly/conf/gradle.properties api/gradle.properties

cd $WORKDIRECTORY/api
gradle clean
gradle war

cp $WORKDIRECTORY/api/build/libs/api.war $WORKDIRECTORY/assembly/assemble/jetty-api/jetty-api.war