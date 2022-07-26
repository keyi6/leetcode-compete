from requests import post
import constants

def get_questions(limit, skip):
    response = post('https://leetcode.com/graphql/', json={
        'query': '''query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList: questionList(
                categorySlug: $categorySlug
                limit: $limit
                skip: $skip
                filters: $filters
            ) {
                total: totalNum
                questions: data {
                    difficulty
                    title
                    titleSlug
                }
            }
        }''',
        'variables': {
            'categorySlug': '',
            'filters': {},
            'limit': limit,
            'skip': skip,
        }
    }, headers=constants.HEADER_FOR_US_ENDPOINT)

    return response.json()['data']['problemsetQuestionList']['questions']
