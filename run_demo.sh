killall node
sh start_nginx_dev.sh
cd webclient
#build bundle javascript first
webpack -d
# we should use http-server here for demo
node_modules/http-server/bin/http-server -p 8080 -s > ../webclient.log 2>&1 &
cd ..
cd aiserver
node server.js s1 > ../aiserver_s1.log 2>&1 &
node server.js s2 > ../aiserver_s2.log 2>&1 &
