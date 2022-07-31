from urllib import response
from requests import post
import leetcode_helper.constants as constants
from leetcode_helper.constants import Endpoint


def _get_recent_submissions_from_us_endpoint(username: str):
    response = post('https://leetcode.com/graphql/', json={
        'query': '''query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
                title
                id
                titleSlug
                timestamp
            }
        }''',
        'variables': {
            'limit': 15, # use 15 because from cn endpoint it can only retrieve recent 15 submissions
            'username': username,
        }
    }, headers=constants.HEADER_FOR_US_ENDPOINT)

    try:
        s = response.json()['data']['recentAcSubmissionList']
        return list(map(lambda x: { **x, 'timestamp': int(x['timestamp']) }, s))
    except:
        return []


def _get_recent_submissions_from_cn_endpoint(username: str):
    response = post('https://leetcode.cn/graphql/noj-go/', json={
        'query': '''query recentAcSubmissions($userSlug: String!) {
            recentACSubmissions(userSlug: $userSlug) {
                submissionId
                submitTime
                question {
                    translatedTitle
                    titleSlug
                }
            }
        }''',
        'variables': {
            'userSlug': username,
        },
    }, headers=constants.HEADER_FOR_CN_ENDPOINT)

    try:
        content = response.json()
        # format the response same as the response from us endpoint
        def formatter(r):
            return {
                'titleSlug': r['question']['titleSlug'],
                'title': r['question']['translatedTitle'],
                'timestamp': r['submitTime'],
                'id': str(r['submissionId']),
            }

        return list(map(formatter, content['data']['recentACSubmissions']))
    except:
        return []


def get_recent_submissions(username: str, endpoint: Endpoint):
    if endpoint == Endpoint.CN:
        return _get_recent_submissions_from_cn_endpoint(username)
    if endpoint == Endpoint.US:
        return _get_recent_submissions_from_us_endpoint(username)
