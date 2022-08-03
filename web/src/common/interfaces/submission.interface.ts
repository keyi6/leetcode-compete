import { Difficulty } from "../constants";

export interface ISubmission {
    timestamp: number;
    title: string;
    titleSlug: string;
    difficulty: Difficulty;
}
