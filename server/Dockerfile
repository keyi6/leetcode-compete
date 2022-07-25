FROM python:3.9.13-alpine3.15
WORKDIR /var/www/

# create new user www
ENV GROUP_ID=1000 \
    USER_ID=1000
RUN addgroup -g $GROUP_ID www
RUN adduser -D -u $USER_ID -G www www -s /bin/sh
USER www

# install
RUN python -m pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# deploy
EXPOSE 5000
CMD [ "python3", "-m", "gunicorn", "-w", "4", "--bind", "0.0.0.0:5000", "wsgi:app"]
