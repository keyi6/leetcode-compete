import { IUser } from '../user.interface';

export interface ISubmission {
    timestamp: number;
    title: string;
    titleSlug: string;
}

export async function getRecentSubmissions({ username, endpoint }: IUser): Promise<ISubmission[]> {
    return new Promise((resolve, reject) => {
        const mockData = {"data":{"recentAcSubmissionList":[{"timestamp":1651309989,"title":"赎金信","titleSlug":"ransom-note"},{"timestamp":1651160738,"title":"反转字符串","titleSlug":"reverse-string"},{"timestamp":1651160607,"title":"3 的幂","titleSlug":"power-of-three"},{"timestamp":1651160409,"title":"有效的字母异位词","titleSlug":"valid-anagram"},{"timestamp":1651159882,"title":"翻转二叉树","titleSlug":"invert-binary-tree"},{"timestamp":1651159783,"title":"存在重复元素 II","titleSlug":"contains-duplicate-ii"},{"timestamp":1651159601,"title":"存在重复元素","titleSlug":"contains-duplicate"},{"timestamp":1651076170,"title":"七进制数","titleSlug":"base-7"},{"timestamp":1651075824,"title":"汉明距离","titleSlug":"hamming-distance"},{"timestamp":1651075310,"title":"斐波那契数","titleSlug":"fibonacci-number"},{"timestamp":1651075188,"title":"完美数","titleSlug":"perfect-number"},{"timestamp":1650797247,"title":"岛屿数量","titleSlug":"number-of-islands"},{"timestamp":1650555364,"title":"二进制间距","titleSlug":"binary-gap"},{"timestamp":1650554864,"title":"最大单词长度乘积","titleSlug":"maximum-product-of-word-lengths"},{"timestamp":1650554356,"title":"重复的DNA序列","titleSlug":"repeated-dna-sequences"}]}};
        const list: ISubmission[] | undefined = mockData?.data?.recentAcSubmissionList;
        if (list) {
            setTimeout(() => resolve(list), 100);
        } else {
            reject(mockData);
        }
    });
}
