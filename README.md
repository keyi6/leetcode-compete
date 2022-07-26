# LeetCode Compete
LeetCode Compete is a project for you and your friends to compete your leetcode submissions like a competition in apple fitness. It aims to make the preparation for jobs easier and more fun.

👉Check out the [demo](https://leetcode-compete.keyi-li.com/).👈

## deploy
1. create `.env` file \
\* replace `{PORT}` with port number that you like.
```
touch .env
echo port={PORT} > .env
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
- [ ] add `/get-difficulty` api, different score for different type of different.
- [ ] save competition info and recent submissions on server instead of localstorage
