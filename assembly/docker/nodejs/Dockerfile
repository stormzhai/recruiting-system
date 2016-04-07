FROM ubuntu:14.04

# COPY sources.list.trusty /etc/apt/sources.list

RUN apt-get update

RUN apt-get install -y wget \
    && wget -qO- https://deb.nodesource.com/setup_5.x | sudo bash - \
    && apt-get install -y nodejs
