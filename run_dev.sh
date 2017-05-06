killall node
sh start_nginx_dev.sh
cd webclient
npm run dev > ../webclient.log 2>&1 &
cd ..
cd aiserver
node server.js s1 > ../aiserver.log 2>&1 &
