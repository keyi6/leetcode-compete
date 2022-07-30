from flask import Flask, request, jsonify
from flask_pymongo import PyMongo

from mongodb_helper.uri import uri
from leetcode_helper.constants import Endpoint

from leetcode_helper.get_recent_submissions import get_recent_submissions
from leetcode_helper.check_user_exist import check_uesr_exist

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

mongodb_client = PyMongo(app, uri=uri())
db = mongodb_client.db

@app.route('/', methods=['GET'])
def hello():
    '''check if server is running
    '''
    return 'hello', 200


@app.route('/recent-submissions', methods=['GET'])
def recent_submissions():
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
        return 'username is required', 400
    if not endpoint:
        return 'endpoint \'%s\' is not valid' % (request.args.get('ep')), 400

    return get_recent_submissions(username, endpoint)


@app.route('/check-user', methods=['POST'])
def check_uesr():
    post_data = request.get_json()
    if not 'username' in post_data or not post_data['username']:
        return 'username is required', 400
    if not 'endpoint' in post_data or not post_data['endpoint']:
        return 'endpoint is required', 400

    username = post_data['username']
    try:
        endpoint = Endpoint(post_data['endpoint'])
    except:
        return 'endpoint \'%s\' is not valid' % (post_data['endpoint']), 400

    return check_uesr_exist(username, Endpoint(endpoint))


@app.route('/query-difficulty', methods=['POST'])
def query_difficulty():
    '''get difficulty, return 'Easy'/'Medium'/'Hard'
    Parameters
        ----------
        titleSlug: str
    '''
    post_data = request.get_json()
    titleSlug = post_data['titleSlug']
    q = list(db.questions.find({ 'titleSlug': titleSlug }))

    if not q:
        return 'no such problem with titleSlug=`%s`' % (titleSlug), 404
    return q[0]['difficulty'], 200


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
        q = list(db.questions.find({ 'titleSlug': titleSlug }))
        difficulties.append({ 'difficulty': q[0]['difficulty'] if q else None, 'titleSlug': titleSlug })
 
    return jsonify(difficulties), 200

