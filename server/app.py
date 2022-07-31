from flask import Flask, request, jsonify
from mongodb_helper.uri import uri
from mongo import mongo, submissions_mongo

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
mongo.init_app(app, uri('LeetcodeCompete'))
submissions_mongo.init_app(app, uri('LeetcodeSubmissions'))

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
