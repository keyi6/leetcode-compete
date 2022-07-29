#!/bin/sh

# launch mongodb
mongod --fork --logpath /app/logs/mongodb.log
echo "[${0##*/}"$date"] mongodb is up"

# launch flask
python3 -m gunicorn --chdir /app/server -w 4 --bind 0.0.0.0:5000 wsgi:app --daemon --log-file /app/logs/gunicorn.log --log-level=warning
echo "[${0##*/} "$date"] flask is up"

# launch nginx
nginx -g "daemon off;"
echo "[${0##*/} "$date"] nginx is up"

