#!/bin/sh

# launch mongodb
mongod --fork --logpath /app/logs/mongodb.log
echo "["$date"] mongodb is up"

# launch flask
python3 -m gunicorn --chdir /app/server -w 4 --bind 0.0.0.0:5000 wsgi:app --daemon --log-file /app/logs/gunicorn.log --log-level=warning
echo "["$date"] flask is up"

# launch nginx
nginx -g "daemon off;"
echo "["$date"] nginx is up"

