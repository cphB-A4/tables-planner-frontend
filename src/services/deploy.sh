#!/usr/bin/env bash

# PROJECT_NAME="Name or your frontend project, for example movie --> folder you created under /var/www"
# DROPLET_URL="URL for your droplet"
#Rember to give sh file access -->  sudo chmod a+x deploy.sh

PROJECT_NAME="tables-planner-frontend"

DROPLET_URL="167.172.99.0"

echo "##############################"
echo "Building the frontend project"
echo "##############################"
npm run build

echo "##############################"
echo "Deploying Frontend project..."
echo "##############################"

scp -r ./build/* root@$DROPLET_URL:/var/www/$PROJECT_NAME