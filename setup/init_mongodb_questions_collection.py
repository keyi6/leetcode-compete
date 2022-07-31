import sys
import pathlib
from pymongo import MongoClient, InsertOne
from datetime import datetime

# add path to import helper package
current_path = pathlib.Path(__file__).parent.resolve()
server_path = '%s/server' % (current_path.parent.resolve().absolute())
sys.path.insert(0, '%s/leetcode_helper' % (server_path))
sys.path.insert(0, '%s/mongodb_helper' % (server_path))
from get_questions import get_questions
from uri import uri


log = lambda x: print('[%s: %s]' % (__file__, datetime.now()), x)

# connect to mongodb
client = MongoClient(uri('LeetcodeCompete'))
db = client.LeetcodeCompete
collection = db.questions
log('connected to mongodb')

# get questions list and put it into mongodb
questions  = get_questions(2500, 0)
log('get leetcode questions count: %d' % (len(questions)))

# write to mongodb
request = [InsertOne(q) for q in questions]
result = collection.bulk_write(request)

log('done')

