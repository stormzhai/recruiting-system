#!/usr/bin/env bash

set -eo pipefail

if [ "$CONFIG_FILE_DIR" ] && [ -d "$CONFIG_FILE_DIR" ]; then
	cp $CONFIG_FILE_DIR/config.properties paper-api/src/main/resources/config.properties
fi

function section() {
	printf "\e[32m $1"
	echo -e "\033[0m"
}

section "Start assemble paper-api"

cd paper-api
gradle clean
gradle war
cd -

cp paper-api/build/libs/paper-api.war assembly/.release

printf "\e[32m Start Assemble express-api"
echo -e "\033[0m"

cd express-api
npm install
cd -
cp -r express-api assembly/.release
cd assembly/.release
zip -qr express-api.zip express-api
rm -fr express-api
cd -

# web

printf "\e[32m Start Assemble web"
echo -e "\033[0m"
rm -fr web/public/
cd web
npm install
./node_modules/.bin/webpack
cd -
cp -r web/public/assets assembly/.release
cd assembly/.release
zip -qr web.zip assets
rm -fr assets
cd -

# task-queue

printf "\e[32m Start Assemble task-queue"
echo -e "\033[0m"

cd task-queue
npm install
cd -
cp -r task-queue assembly/.release
cd assembly/.release
zip -qr task-queue.zip task-queue
rm -fr task-queue
cd -
