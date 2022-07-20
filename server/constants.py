# TODO: check if python have ES6 like spread operator ... to make codes below elegant

_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36'
_CONTENT_TYPE = 'application/json'

HEADER_FOR_CN_ENDPOINT = {
    'content-type':_CONTENT_TYPE,
    'user-agent': _USER_AGENT,
    'origin': 'https://leetcode.cn',
}

HEADER_FOR_US_ENDPOINT = {
    'content-type':_CONTENT_TYPE,
    'user-agent': _USER_AGENT,
    'origin': 'https://leetcode.com',
}
