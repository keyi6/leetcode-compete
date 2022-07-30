from requests import post
import leetcode_helper.constants as constants
from leetcode_helper.constants import Endpoint

def _check_uesr_exist_from_cn_enpoint(username: str):
    response = post('https://leetcode.cn/graphql/', json={
        'query': '''query userProfilePublicProfile($userSlug: String!) {
            userProfilePublicProfile(userSlug: $userSlug) {
                profile {
                    userSlug
                }
            }
        }''',
        'variables': {
            'userSlug': username,
        },
    }, headers=constants.HEADER_FOR_CN_ENDPOINT)

    if response.json()['data']['userProfilePublicProfile']: return 'exists', 200
    return 'does not exist', 404


def _check_uesr_exist_from_us_enpoint(username: str):
    response = post('https://leetcode.com/graphql/', json={
        'query': '''query userProfile($username: String!) {
            matchedUser(username: $username) {
                username
            }
        }''',
        'variables': {
            'username': username,
        },
    }, headers=constants.HEADER_FOR_US_ENDPOINT)

    if response.json()['data']['matchedUser']: return 'exists', 200
    return 'does not exist', 404


def check_uesr_exist(username: str, endpoint: Endpoint):
    if endpoint == Endpoint.CN:
        return _check_uesr_exist_from_cn_enpoint(username)
    if endpoint == Endpoint.US:
        return _check_uesr_exist_from_us_enpoint(username)
 