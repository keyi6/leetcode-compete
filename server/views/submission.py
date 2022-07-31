from flask import Blueprint, request, jsonify
import utils
from leetcode_helper.get_recent_submissions import get_recent_submissions

submission_api = Blueprint('submission', __name__)

@submission_api.route('/query-recent-submissions', methods=['POST'])
def query_recent_submissions():
    post_data = request.get_json()
    try:
        [username, endpoint] = utils.check_user_parameter(post_data)
    except Exception as exp:
        return utils.invalid_request(exp)

    return get_recent_submissions(username, endpoint)
