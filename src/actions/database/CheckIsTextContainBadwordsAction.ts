import {badwordDatabase} from "../../services/database";

export default class CheckIsTextContainBadwordsAction {
    public static async execute(text: string): Promise<boolean> {
       try {
           const words = await badwordDatabase.getData('/words')
           const pattern = new RegExp("\\b(" + words.join("|") + ")\\b", "i");

           return pattern.test(text);
       } catch (Error) {
           console.log('words is not available yet')

           return false
       }
    }
}