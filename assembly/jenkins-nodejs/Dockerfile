FROM jenkins:1.625.3

USER root

RUN apt-get update

RUN apt-get install -y wget \
    && wget -qO- https://deb.nodesource.com/setup_5.x | bash - \
    && apt-get install -y nodejs
