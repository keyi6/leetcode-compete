import { IUser } from '../interfaces';

export interface ISubmission {
    timestamp: number;
    title: string;
    titleSlug: string;
}

export async function getRecentSubmissions({ username, endpoint }: IUser): Promise<ISubmission[]> {
    return new Promise((resolve, reject) => {
        const mockData1 = {"data":{"recentAcSubmissionList":[{"timestamp":1651309989,"title":"赎金信","titleSlug":"ransom-note"},{"timestamp":1651160738,"title":"反转字符串","titleSlug":"reverse-string"},{"timestamp":1651160607,"title":"3 的幂","titleSlug":"power-of-three"},{"timestamp":1651160409,"title":"有效的字母异位词","titleSlug":"valid-anagram"},{"timestamp":1651159882,"title":"翻转二叉树","titleSlug":"invert-binary-tree"},{"timestamp":1651159783,"title":"存在重复元素 II","titleSlug":"contains-duplicate-ii"},{"timestamp":1651159601,"title":"存在重复元素","titleSlug":"contains-duplicate"},{"timestamp":1651076170,"title":"七进制数","titleSlug":"base-7"},{"timestamp":1651075824,"title":"汉明距离","titleSlug":"hamming-distance"},{"timestamp":1651075310,"title":"斐波那契数","titleSlug":"fibonacci-number"},{"timestamp":1651075188,"title":"完美数","titleSlug":"perfect-number"},{"timestamp":1650797247,"title":"岛屿数量","titleSlug":"number-of-islands"},{"timestamp":1650555364,"title":"二进制间距","titleSlug":"binary-gap"},{"timestamp":1650554864,"title":"最大单词长度乘积","titleSlug":"maximum-product-of-word-lengths"},{"timestamp":1650554356,"title":"重复的DNA序列","titleSlug":"repeated-dna-sequences"}]}};
        const mockData2 = {"data":{"recentAcSubmissionList":[{"timestamp":1658567999,"title":"求根节点到叶节点数字之和","titleSlug":"sum-root-to-leaf-numbers"},{"timestamp":1658567723,"title":"求根节点到叶节点数字之和","titleSlug":"sum-root-to-leaf-numbers"},{"timestamp":1658565761,"title":"平衡二叉树","titleSlug":"balanced-binary-tree"},{"timestamp":1658564894,"title":"二叉树的最大深度","titleSlug":"maximum-depth-of-binary-tree"},{"timestamp":1658564746,"title":"最小栈","titleSlug":"min-stack"},{"timestamp":1658563984,"title":"最小覆盖子串","titleSlug":"minimum-window-substring"},{"timestamp":1658560506,"title":"二叉树的前序遍历","titleSlug":"binary-tree-preorder-traversal"},{"timestamp":1658560261,"title":"二叉树的前序遍历","titleSlug":"binary-tree-preorder-traversal"},{"timestamp":1658560116,"title":"从前序与中序遍历序列构造二叉树","titleSlug":"construct-binary-tree-from-preorder-and-inorder-traversal"},{"timestamp":1658560092,"title":"从前序与中序遍历序列构造二叉树","titleSlug":"construct-binary-tree-from-preorder-and-inorder-traversal"},{"timestamp":1658487494,"title":"滑动窗口最大值","titleSlug":"sliding-window-maximum"},{"timestamp":1657874779,"title":"复原 IP 地址","titleSlug":"restore-ip-addresses"},{"timestamp":1657723600,"title":"最长公共子序列","titleSlug":"longest-common-subsequence"},{"timestamp":1657638853,"title":"缺失的第一个正数","titleSlug":"first-missing-positive"},{"timestamp":1657637590,"title":"括号生成","titleSlug":"generate-parentheses"}]}};
        // TODO
        const data = username === 'cjhahaha' ? mockData1.data!.recentAcSubmissionList : mockData2.data.recentAcSubmissionList;
        setTimeout(() => resolve(data.map(d => ({...d, timestamp: d.timestamp * 1000}))), 100);
    });
}
