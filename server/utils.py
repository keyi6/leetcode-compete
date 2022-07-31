from flask import jsonify
from leetcode_helper.constants import Endpoint

def check_user_parameter(post_data: dict):
    if not 'username' in post_data or not post_data['username']:
        raise Exception('check_user_parameter failed | username is required')
    if not 'endpoint' in post_data or not post_data['endpoint']:
        raise Exception('check_user_parameter failed | endpoint is required')

    username = post_data['username']
    try:
        endpoint = Endpoint(post_data['endpoint'])
    except:
        raise Exception('check_user_parameter failed | endpoint \'%s\' is not valid' % (post_data['endpoint']))

    return [username, endpoint]


def invalid_request(err):
    if not isinstance(err, str): err = str(err)
    return jsonify({ 'err': err }), 400
