#!/bin/bash

mongo <<EOF
    var user="USER";
    var pwd="PWD";

    use LeetcodeCompete;
    db.createUser({user: user, pwd: pwd, roles: ["readWrite"]});
EOF

python3 ./init_questions_collection.py

