#!/bin/bash

# create user
mongo < ./init_mongodb_create_user.js
# add initial data
python3 ./init_mongodb_questions_collection.py

# create collection: competitions
mongo < ./init_mongodb_create_competitions.js

