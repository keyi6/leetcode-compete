from flask import Flask, request
from helper import get_recent_submission, Endpoint

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

@app.route('/recent-submissions', methods=['GET'])
def get_recent_submissions():
    '''get recent submissions
    Parameters
        ----------
        u: str
            username
        ep: Endpoint
            the endpoint, either 'us' or 'cn'
    '''
    # get username from querystring
    username = request.args.get('u', type=str)
    # get endpoint from querystring
    endpoint = request.args.get('ep', type=Endpoint)

    # check if parameters are valid
    if not username:
        return 'username are required', 400
    if not endpoint:
        return 'endpoint \'%s\' is not valid' % (request.args.get('ep')), 400

    content, status_code = get_recent_submission(username, endpoint)
    return content, status_code
