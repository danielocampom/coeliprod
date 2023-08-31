@echo off

java -jar ./back/coeli-1.0.0.jar
cd front && npm i && npm run serve