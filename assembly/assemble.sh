#!/usr/bin/env bash
set -e
rm -fr assembly/assemble/jetty-api/*
cp assembly/conf/config.properties api/src/main/resources/config.properties
cp assembly/conf/gradle.properties api/gradle.properties

cd api
./gradlew clean
./gradlew war
cd -

cp api/build/libs/api.war assembly/assemble/jetty-api/jetty-api.war
