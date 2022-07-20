from crypt import methods
import requests
from flask import Flask, request

app = Flask(__name__)


@app.route('/recent-submissions', methods=['GET'])
def getRecentSubmissions():
    '''
    Parameters(in querystring)
        ----------
        u: str
            The username
    '''
    userSlug = request.args.get('u', default = '', type = str)
    r = requests.post('https://leetcode.cn/graphql/noj-go/', json={
        'query': '''query recentAcSubmissions($userSlug: String!) {
            recentACSubmissions(userSlug: $userSlug) {
                submitTime
                question {
                    translatedTitle
                    titleSlug
                    questionFrontendId
                }
            }
        }''',
        'variables': {
            'userSlug': userSlug,
        },
    }, headers={
        'content-type': 'application/json',
        'origin': 'https://leetcode.cn',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36',
    })

    return r.content, r.status_code
