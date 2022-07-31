from flask import Blueprint, request, jsonify
import urllib.parse

from leetcode_helper.constants import Endpoint
from leetcode_helper.get_recent_submissions import get_recent_submissions
from mongo import submissions_mongo, mongo
import utils

submission_api = Blueprint('submission', __name__)
submissions_db = submissions_mongo.db

SEVEN_DAYS = 7 * 24 * 60 * 60

def username_to_collection_name(username: str, endpoint: Endpoint):
    return urllib.parse.quote_plus('%s%s' % (username, endpoint.value))


@submission_api.route('/query-recent-submissions', methods=['POST'])
def query_recent_submissions():
    post_data = request.get_json()
    try:
        [username, endpoint] = utils.check_user_parameter(post_data)
    except Exception as exp:
        return utils.invalid_request(exp)

    collection_name = username_to_collection_name(username, endpoint)
    collection = submissions_db[collection_name]

    collection.create_index('expireAt', expireAfterSeconds=0)

    for s in [{ **s, 'expireAt': s['timestamp'] + SEVEN_DAYS} for s in get_recent_submissions(username, endpoint)]:
        collection.update_one({'id': s['id']}, {'$set': s}, upsert=True)
    
    submissions = list(collection.aggregate([{
        '$project': {
            '_id': 0,
            'title': 1,
            'titleSlug': 1,
            'id': 1,
            'timestamp': 1,
        },
    }])) 

    submissions_with_difficulty = []
    for s in submissions:
        q = mongo.db.questions.find_one({ 'titleSlug': s['titleSlug'] })
        submissions_with_difficulty.append({
            **s,
            'difficulty': q['difficulty'] if q else None,
        })

    return jsonify({ 'submissions': submissions_with_difficulty }), 200
