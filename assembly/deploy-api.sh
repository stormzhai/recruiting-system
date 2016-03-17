#!/usr/bin/env bash

set -e

rm -fr assembly/assemble/jetty-api/*
cp -r api/* assembly/assemble/jetty-api
cp assembly/conf/config.properties assembly/assemble/jetty-api/src/main/resources/config.properties
cp assembly/conf/gradle.properties assembly/assemble/jetty-api/gradle.properties

cd assembly/assemble/jetty-api
gradle clean
gradle war
gradle flywayClean
gradle flywayMigrate
cd -

mkdir -p assembly/assemble/tmp

cp assembly/assemble/jetty-api/build/libs/jetty-api.war assembly/assemble/tmp
rm -fr assembly/assemble/jetty-api/*
cp assembly/assemble/tmp/jetty-api.war assembly/assemble/jetty-api

rm -fr assembly/assemble/tmp