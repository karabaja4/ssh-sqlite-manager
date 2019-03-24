#!/bin/bash

echo "navigating to dir"
cd /home/igor/git/ssh-sqlite-manager/

echo "cleaning dist"
rm -rf dist
mkdir -p dist

echo "installing node modules"
rm -rf node_modules
npm install

#rm -rf node_modules/csvtojson/.nyc_output/*
#rm -rf node_modules/csvtojson/.ts-node/*

echo "packaging"
electron-packager --platform=linux --arch=x64 .

echo "compressing"
#zip -r ssh-sqlite-manager-darwin-x64.zip ssh-sqlite-manager-darwin-x64
# zip -r ssh-sqlite-manager-win32-x64.zip ssh-sqlite-manager-win32-x64
# zip -r ssh-sqlite-manager-win32-ia32.zip ssh-sqlite-manager-win32-ia32
zip -r ssh-sqlite-manager-linux-x64.zip ssh-sqlite-manager-linux-x64
#zip -r ssh-sqlite-manager-linux-ia32.zip ssh-sqlite-manager-linux-ia32

mv *.zip dist/

rm -rf ssh-sqlite-manager-*

