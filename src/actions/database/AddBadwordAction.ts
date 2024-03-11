import {badwordDatabase} from "../../services/database";

export default class AddBadwordAction {
    public static async execute(texts: string[]): Promise<boolean> {
        const words = await badwordDatabase.getData('/words')

        texts.map((text: string) => {
            if(words.join(',').includes(text)) {
                return;
            }

            words.push(text.trim());
        })

        badwordDatabase.push('/words', words);

        return true
    }
}