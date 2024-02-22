import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {
    EnhancedGenerateContentResponse,
    GenerateContentResult,
    GenerativeModel,
    GoogleGenerativeAI
} from "@google/generative-ai"

export default class AnswerThanksAction extends BaseMessageHandlerAction {
    alias: string | null = null;
    category: string | null = null;
    description: string | null = null;
    showInList: boolean = false;

    hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return null
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt: string = '"input: terima kasih yaaa mas\n' +
            '\n' +
            'please give a json format to define that\'s giving thanks input or not and please provide the possible slang answer of the input to let me answer them as json property,and please consider the context does the input really wanna aim to say thanks or not or have another means. Please give me consistent structure because i will ask question like this and please just resposne with json data only no need another information i want parse it to my program \n' +
            '\n' +
            'the json structure like below \n' +
            '{\n' +
            ' "input": string,\n' +
            ' "is_thanks": boolean,\n' +
            ' "possible_answers": [\n' +
            ' {\n' +
            '  "text": string,\n' +
            '  "context": string\n' +
            ' },\n' +
            ' ]\n' +
            '}\n' +
            '"'

        const result: GenerateContentResult = await model.generateContent(prompt);
        const response: EnhancedGenerateContentResponse = await result.response;
        const text: string = response.text();
        console.log(text);

        message;
        socket

    }

    usageExample(): string {
        return "";
    }
}