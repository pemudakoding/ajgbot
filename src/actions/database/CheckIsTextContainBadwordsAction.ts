import {badwordDatabase} from "../../services/database";

export default class CheckIsTextContainBadwordsAction {
    public static async execute(text: string): Promise<boolean> {
       try {
           const words = await badwordDatabase.getData('/words')

           const inputLowercase = text.toLowerCase(); // Convert input to lowercase for case-insensitive matching
           for (let i = 0; i < words.length; i++) {
               const badWord = words[i];
               if (inputLowercase.indexOf(badWord) !== -1) {
                   return true;
               }
           }

           return false;
       } catch (Error) {
           console.log('words is not available yet')

           return false
       }
    }
}