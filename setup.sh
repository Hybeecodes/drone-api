#!/bin/sh
echo "INSTALL DEPENDENCIES"
npm install
echo "RUN BUILD"
npm run build
echo "RUN DB MIGRATIONS"
npm run migration:run
echo "SETUP COMPLETED"
