FROM ubuntu:20.04
SHELL ["/bin/bash", "-c"]

# === install ===
# install dependency
RUN apt update
RUN apt install -y curl wget gnupg libcurl4 openssl liblzma5
# install mongodb
WORKDIR /usr/mongo
RUN mkdir -p /usr/mongo
RUN wget -nv https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.15.tgz
RUN tar -zxvf mongodb-linux-x86_64-ubuntu2004-4.4.15.tgz
RUN cp /usr/mongo/mongodb-linux-x86_64-ubuntu2004-4.4.15/bin/* /usr/local/bin/
# install python
RUN apt install -y python3 python3-pip
RUN python3 --version
# install node
RUN curl -sL https://deb.nodesource.com/setup_14.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt install -y nodejs
# install nginx
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -y nginx


# === prepare ===
WORKDIR /app
COPY . .


# === build ===
## build react
WORKDIR /app/web
ENV NODE_ENV production
# update npm
RUN npm i -g npm@8
RUN npm ci --include=dev
# get static file
RUN npm run build

## build flask
WORKDIR /app/server
# install
RUN python3 -m pip install --upgrade pip
RUN pip3 install --no-cache-dir -r requirements.txt


# === config ===
# setup nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html
RUN cp -r /app/web/build /usr/share/nginx/html
EXPOSE 80


# === setup ===
WORKDIR /app/setup
# prepare required dir
RUN mkdir -p /data/db
RUN mkdir -p /app/logs

RUN chmod +x ./init_mongodb.sh
RUN chmod +x ./entrypoint.sh

# init mongodb
ARG MONGODB_USER
ARG MONGODB_PASSWORD
RUN sed -i -e 's/USER/'$MONGODB_USER'/g' ./init_mongodb_create_user.js
RUN sed -i -e 's/PWD/'$MONGODB_PASSWORD'/g' ./init_mongodb_create_user.js
RUN mongod --fork --logpath /app/logs/mongodb.log && ./init_mongodb.sh

# entry point shell
ENTRYPOINT ["/app/setup/entrypoint.sh"]
