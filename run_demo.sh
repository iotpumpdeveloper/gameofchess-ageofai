killall node
sh start_nginx_dev.sh
cd webclient
#build bundle javascript first
webpack -d
npm run demo > ../webclient.log 2>&1 &
cd ..
cd aiserver
node server.js s1 > ../aiserver.log 2>&1 &
