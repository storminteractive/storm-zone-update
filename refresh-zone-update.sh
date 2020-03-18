WD=/root/scripts/storm-zone-update
REPO=https://github.com/storminteractive/storm-zone-update

# Detecting process by port number
#pm2 start /root/scripts/storm-zone-update/index.js --name zone-update
pm2 stop zone-update

rm -rf $WD
git clone $REPO $WD

npm install --cwd $WD/ --prefix $WD/
#npm install

cp /root/ssl/ssl.* $WD

pm2 restart zone-update
