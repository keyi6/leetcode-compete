from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
import utils

from mongo import mongo

competition_api = Blueprint('competition', __name__)
db = mongo.db

@competition_api.route('/start-competition', methods=['POST'])
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
            'competitionId': str(check_ongoing_competition['competitionId']),
            'startTime': int(datetime.timestamp(check_ongoing_competition['startTime'])),
            'endTime': int(datetime.timestamp(check_ongoing_competition['endTime'])),
        }), 200

    start_time = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(hours=24)
    end_time = start_time + timedelta(days=7)
    res = {
        'competitionId': uuid.uuid4(),
    }

    db.competitions.insert_one({
        **res,
        'startTime': start_time,
        'endTime': end_time,
        'participants': list(map(lambda x: { 'username': x[0], 'endpoint': x[1].value }, participants)),
    })

    return jsonify({
        **res,
        'status': True,
        'startTime': int(datetime.timestamp(start_time)),
        'endTime': int(datetime.timestamp(end_time)),
    }), 200


@competition_api.route('/query-competition', methods=['POST'])
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


@competition_api.route('/query-my-competitions', methods=['POST'])
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
