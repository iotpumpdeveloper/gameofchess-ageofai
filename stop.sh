# stop all servers
echo 'killing all node servers';
killall node
echo 'stopping nginx';
sudo nginx -c $(pwd nginx_dev.conf)/nginx_dev.conf -s stop
