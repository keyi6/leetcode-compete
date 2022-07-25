# leetcode compete server
This is a simple flask application.

Environment: python@3.8

## scenario
WORKDIR: `server/`

### run
step 1. install dependencies
```sh
pip install -r requirements.txt
```

step2. run the project in development mode
```sh
python wsgi.py
```
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.


### deploy
It uses nginx to pass proxy and docker to deploy both frontend and backend.
