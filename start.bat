@echo off

start /b java -jar ./back/coeli-1.0.0.jar
cd /d front
npm i && npm run serve