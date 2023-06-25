echo off

start java -jar ./back/coeli-1.0.0.jar
start cd front && npm i && npm run serve