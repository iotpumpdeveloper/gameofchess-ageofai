killall node
sh start_nginx_dev.sh
cd webclient
#build bundle javascript first
webpack -d
npm run demo > ../webclient.log 2>&1 &
cd ..
cd aiserver
node --harmony-async-await server.js s1 > ../aiserver_s1.log 2>&1 &
node --harmony-async-await server.js s2 > ../aiserver_s2.log 2>&1 &
