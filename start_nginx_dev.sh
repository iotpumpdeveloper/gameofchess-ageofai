# first make sure we have nginx reload
echo starting nginx
sudo nginx -c $(pwd nginx_dev.conf)/nginx_dev.conf -s stop
sudo nginx -c $(pwd nginx_dev.conf)/nginx_dev.conf
