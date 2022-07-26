import os
import sys
import json
import pathlib
import urllib.parse
from dotenv import load_dotenv
from pymongo import MongoClient, InsertOne

# add path to import helper package
current_path = pathlib.Path(__file__).parent.resolve() 
server_path = current_path.parent.resolve()
sys.path.insert(0, '%s/leetcode_helper' % (server_path.absolute()))
sys.path.insert(0, '%s/mongodb_helper' % (server_path.absolute()))

from get_questions import get_questions
from connect import connect


# connect to mongodb
db = connect()
collection = db.questions
print('connected to mongodb')

# get questions list and put it into mongodb
questions  = get_questions(2500, 0)
print('get leetcode questions count: %d' % (len(questions)))
request = [InsertOne(q) for q in questions]
result = collection.bulk_write(request)
