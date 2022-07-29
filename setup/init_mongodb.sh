#!/bin/bash

mongo <<EOF
    var user="USER";
    var pwd="PWD";

    use LeetcodeCompete;
    db.createUser({user: user, pwd: pwd, roles: ["readWrite"]});
EOF

cd /app
python3 ./server/setup/init_questions_collection.py

