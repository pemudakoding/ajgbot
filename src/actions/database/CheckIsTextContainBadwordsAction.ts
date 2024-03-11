import {badwordDatabase} from "../../services/database";
import BadWordsNext from "bad-words-next";

export default class CheckIsTextContainBadwordsAction {
    public static async execute(text: string): Promise<boolean> {
       try {
           const data = await badwordDatabase.getData('/')
           const badwords = new BadWordsNext({data})

           return badwords.check(text);
       } catch (Error) {
           console.log('words is not available yet')

           return false
       }
    }
}