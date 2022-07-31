from flask import Flask, request, jsonify
from mongodb_helper.uri import uri
from mongo import mongo

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
mongo.init_app(app, uri())

from views.user import user_api
from views.competition import competition_api
from views.submission import submission_api

app.register_blueprint(user_api)
app.register_blueprint(competition_api)
app.register_blueprint(submission_api)


@app.route('/', methods=['GET'])
def hello():
    '''check if server is running
    '''
    return 'hello', 200


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
