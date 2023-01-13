#!/bin/sh
#To run the file execute <bash heroku.sh>

cd ./frontend
cp .env-heroku .env
npm run build
cd ../api
cp .env-heroku .env
cd ./config
cp database-heroku.php database.php