from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
import uuid

from mongodb_helper.uri import uri
from leetcode_helper.constants import Endpoint
from leetcode_helper.get_recent_submissions import get_recent_submissions
from leetcode_helper.check_user_exist import check_user_exist
import utils

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

mongodb_client = PyMongo(app, uri='%s?uuidRepresentation=standard' % uri())
db = mongodb_client.db

@app.route('/', methods=['GET'])
def hello():
    '''check if server is running
    '''
    return 'hello', 200


@app.route('/query-recent-submissions', methods=['POST'])
def query_recent_submissions():
    post_data = request.get_json()
    try:
        [username, endpoint] = utils.check_user_parameter(post_data)
    except Exception as exp:
        return utils.invalid_request(exp)

    return get_recent_submissions(username, endpoint)


@app.route('/check-user', methods=['POST'])
def check_user():
    post_data = request.get_json()
    try:
        [username, endpoint] = utils.check_user_parameter(post_data)
    except Exception as exp:
        return utils.invalid_request(exp)

    exist = check_user_exist(username, Endpoint(endpoint))
    res = { 'status': exist }

    if not exist:
        res['err'] = 'User with username "%s" in "%s" endpoint does not exist.' % (username, post_data['endpoint'])
    return jsonify(res), 200


@app.route('/query-difficulty', methods=['POST'])
def query_difficulty():
    '''get difficulty, return 'Easy'/'Medium'/'Hard'
    Parameters
        ----------
        titleSlug: str
    '''
    post_data = request.get_json()
    titleSlug = post_data['titleSlug']
    q = list(db.questions.find_one({ 'titleSlug': titleSlug }))

    if not q:
        return 'no such problem with titleSlug=`%s`' % (titleSlug), 404
    return q['difficulty'], 200


@app.route('/query-difficulties', methods=['POST'])
def query_difficulties():
    '''get difficulties
    Parameters
        ----------
        titleSlugs: [str]
    '''
    post_data = request.get_json()
    titleSlugs = post_data['titleSlugs']

    difficulties = []
    for titleSlug in titleSlugs: 
        q = list(db.questions.find_one({ 'titleSlug': titleSlug }))
        difficulties.append({ 'difficulty': q['difficulty'] if q else None, 'titleSlug': titleSlug })
 
    return jsonify(difficulties), 200


@app.route('/start-competition', methods=['POST'])
def start_competition():
    post_data = request.get_json()
    if not 'participants' in post_data:
        return utils.invalid_request('participants list is required')
    if not isinstance(post_data['participants'], list):
        return utils.invalid_request('participants must be a list of users')
    try:
        participants = list(map(lambda x: utils.check_user_parameter(x), post_data['participants']))
    except Exception as exp:
        return utils.invalid_request(exp)

    check_ongoing_competition = db.competitions.find_one({
        'participants': {
            '$all': [{
                '$elemMatch': { 'username': username, 'endpoint': endpoint.value }
            } for username, endpoint in participants]
        }
    })

    if check_ongoing_competition:
        return jsonify({
            'status': False,
            'err': 'There is an ongoing competition',
            'competitionId': str(check_ongoing_competition['competitionId'])
        }), 200

    tomorrow = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(hours=24)
    res = {
        'startTime': tomorrow,
        'endTime': tomorrow + timedelta(days=7),
        'competitionId': uuid.uuid4(),
    }

    db.competitions.insert_one({
        **res,
        'participants': list(map(lambda x: { 'username': x[0], 'endpoint': x[1].value }, participants)),
    })

    return jsonify({ **res, 'status': True }), 200


@app.route('/query-competition', methods=['POST'])
def query_competition():
    post_data = request.get_json()
    if not 'competitionId' in post_data or not post_data['competitionId']:
        return utils.invalid_request('competitionId is required')
    
    competition_id = uuid.UUID(post_data['competitionId'])
    res = db.competitions.aggregate([
        { '$match': { 'competitionId': competition_id } },
        { '$limit': 1 },
        {
            '$project': {
                "_id" : 0,
                "startTime": { "$toLong": "$startTime" },
                "endTime": { "$toLong": "$endTime" },
                "participants": 1,
                "competitionId": 1,
            },
        },
    ])

    competitions = [r for r in res]
    if not competitions:
        return jsonify({
            'status': False,
            'err': 'no competition with id=%s found' % (post_data['competitionId']),
        })

    return jsonify({ 'status': True, **competitions[0] }), 200


@app.route('/query-my-competitions', methods=['POST'])
def query_my_competitions():
    post_data = request.get_json()
    try:
        [username, endpoint] = utils.check_user_parameter(post_data)
    except Exception as exp:
        return utils.invalid_request(exp)

    competitions = db.competitions.aggregate([
        {
            '$match': {
                'participants': {
                    '$elemMatch': { 'username': username, 'endpoint': endpoint.value }
                }
            }
        },
        {
            "$project": {
                "_id" : 0,
                "startTime": { "$toLong": "$startTime" },
                "endTime": { "$toLong": "$endTime" },
                "participants": 1,
                "competitionId": 1,
            }
        }
    ])

    return jsonify({ 'competitions': [c for c in competitions] }), 200
