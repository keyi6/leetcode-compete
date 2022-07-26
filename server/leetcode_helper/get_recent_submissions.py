from enum import Enum
from requests import post
import leetcode_helper.constants as constants

class Endpoint(Enum):
    US = 'us'
    CN = 'cn'


def _get_recent_submissions_from_us_endpoint(username: str):
    response = post('https://leetcode.com/graphql/', json={
        'query': '''query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
                title
                titleSlug
                timestamp
            }
        }''',
        'variables': {
            'limit': 15, # use 15 because from cn endpoint it can only retrieve recent 15 submissions
            'username': username,
        }
    }, headers=constants.HEADER_FOR_US_ENDPOINT)

    return response.json(), response.status_code


def _get_recent_submissions_from_cn_endpoint(username: str):
    response = post('https://leetcode.cn/graphql/noj-go/', json={
        'query': '''query recentAcSubmissions($userSlug: String!) {
            recentACSubmissions(userSlug: $userSlug) {
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

    content = response.json()
    # format the response same as the response from us endpoint
    if response.status_code == 200 and content['data']['recentACSubmissions']:
        def formatter(r):
            return {
                'titleSlug': r['question']['titleSlug'],
                'title': r['question']['translatedTitle'],
                'timestamp': r['submitTime'],
            }

        content = {
            'data': {
                'recentAcSubmissionList': list(map(formatter, content['data']['recentACSubmissions'])),
            }
        }
    return content, response.status_code


def get_recent_submissions(username: str, endpoint: Endpoint):
    if endpoint == Endpoint.CN:
        return _get_recent_submissions_from_cn_endpoint(username)
    if endpoint == Endpoint.US:
        return _get_recent_submissions_from_us_endpoint(username)
