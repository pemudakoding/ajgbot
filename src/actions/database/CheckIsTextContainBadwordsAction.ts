import {badwordDatabase} from "../../services/database";

export default class CheckIsTextContainBadwordsAction {
    public static async execute(text: string): Promise<boolean> {
        const words = await badwordDatabase.getData('/words')

        return words.some((word: string) => text.toLowerCase().includes(word))
    }
}