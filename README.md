# LeetCode Compete
LeetCode Compete is a project for you and your friends to compete your leetcode submissions like a competition in apple fitness. It aims to make the preparation for jobs easier and more fun.
This project also provides a docker image for users who want to private deployment. Check [deploy]('https://github.com/cjhahaha/leetcode-compete#deploy') for instructions.

👉Check out the [demo](https://leetcode-compete.keyi-li.com/).👈
Learn about rule: [rules](https://leetcode-compete.keyi-li.com/#/rules).

## deploy
1. create `.env` file \
\* replace `{VAR}` with stuff that that you like.
```
touch .env
echo port={PORT} >> .env
echo mongodb_user={MONGODB_USER} >> .env
echo mongodb_password={MONGODB_PASSWORD} >> .env
```
Here is an example of `.env` file.
```.env
port=3333
mongodb_user=ohmygosh_im_dbadmin
mongodb_password=foobar
```

2. build a docker image and startup a container.
```sh
docker-compose up --build -d
```

3. check container status
```sh
docker ps
```
If the output looks like below, it is running well.
```
CONTAINER ID   IMAGE                COMMAND                PORTS
xxxxxxxxxxxx   leetcode-compete_s   "/app/entrypoint.sh"   0.0.0.0:{PORT}->80/tcp, :::{PORT}->80/tcp
```
4. `Leetcode-Compete` is up and running successfully!
Open [http://localhost:{PORT}](http://localhost:{PORT}) in your browser to get start!


## development
// TODO


## todo
There are a lot of work going on.
- [ ] i10n
- [ ] cronjob update leetcode information
- [ ] persistent competition result
