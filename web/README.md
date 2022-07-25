# leetcode compete web
This is a project created by CRA.

Environment: node@16, npm@8

## scenario
WORKDIR: `web/`

### run
step 1. install dependencies
```sh
npm install 
```

step2. run the project in development mode
```sh
npm run start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### build
step 1.install dependencies
```sh
npm ci --include=dev
```
step2. build
```sh
npm run build
```
The built files are in `/build`;

### deploy
It uses nginx to distribute built files and docker to deploy both frontend and backend.
