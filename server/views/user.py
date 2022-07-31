from flask import Blueprint, Flask, request, jsonify
from leetcode_helper.constants import Endpoint
from leetcode_helper.get_recent_submissions import get_recent_submissions
from leetcode_helper.check_user_exist import check_user_exist
import utils

user_api = Blueprint('user', __name__)

@user_api.route('/check-user', methods=['POST'])
def check_user():
    post_data = request.get_json()
    try:
        [username, endpoint] = utils.check_user_parameter(post_data)
    except Exception as exp:
        return utils.invalid_request(exp)

    exist = check_user_exist(username, Endpoint(endpoint))
    res = { 'status': exist }

    if not exist:
        res['err'] = 'User with username "%s" in "%s" endpoint does not exist.' % (
            username, post_data['endpoint'])
    return jsonify(res), 200
