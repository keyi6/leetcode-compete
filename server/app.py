from flask import Flask, request, jsonify
from leetcode_helper.get_recent_submissions import get_recent_submissions, Endpoint
from mongodb_helper.uri import uri
from flask_pymongo import PyMongo

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
        return 'username are required', 400
    if not endpoint:
        return 'endpoint \'%s\' is not valid' % (request.args.get('ep')), 400

    content, status_code = get_recent_submissions(username, endpoint)
    return content, status_code


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

