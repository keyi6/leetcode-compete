FROM alpine:3.14

RUN apk update
# install python
RUN apk add --no-cache python3 py3-pip
# install node
RUN apk add --no-cache nodejs npm
# install nginx
RUN apk add --no-cache nginx

## build flask
WORKDIR /app/backend
# TODO: delete
RUN python3 --version
# install
RUN python3 -m pip install --upgrade pip
COPY ./server/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt
COPY ./server/ .


## build react
WORKDIR /app/frontend
ENV NODE_ENV production
COPY ./web .
# update npm
RUN npm i -g npm@8
RUN npm ci --include=dev
# get static file
RUN npm run build


# setup nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html
RUN cp -r /app/frontend/build /usr/share/nginx/html

EXPOSE 80


# create startup bash
WORKDIR /app
RUN touch entrypoint.sh
RUN echo "#!/bin/sh" > entrypoint.sh
RUN echo "python3 -m gunicorn --chdir /app/backend -w 4 --bind 0.0.0.0:5000 wsgi:app --daemon" >> entrypoint.sh
#RUN echo "nginx -g daemon off;" >> entrypoint.sh
RUN echo "nginx -g \"daemon off;\"" >> entrypoint.sh
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
