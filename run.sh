#!/bin/bash

GREEN='\033[1;32m'
NC='\033[0m' # No Color
echo "Composer update";
composer self-update
echo "Composer install";
composer install
echo "Create upload dir";
composer require studio-42/elfinder
composer update
mkdir -p web/uploads/files/images;
echo "Create log";
mkdir -p log;
echo "Clear cache";
php symfony cc;
echo "Create db dir";
mkdir data/db;
echo "Create db.sqlite file";
touch data/db/db.sqlite;
echo "Prepare project";
php symfony doctrine:build --all --and-load --no-confirmation;
php symfony cc;
chmod 0777 cache;
chmod 0777 log;
printf "${GREEN}Remove images\n${NC}"
rm -rf web/uploads/files/images/*;
printf "${GREEN}Clear cache\n${NC}"
php symfony cc;

npm install;
gulp download;
gulp js_dev;
gulp js;
gulp css;

printf "${GREEN}Finish :)\n${NC}"
