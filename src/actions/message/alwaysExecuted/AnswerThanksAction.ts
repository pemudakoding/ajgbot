import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {
    EnhancedGenerateContentResponse,
    GenerateContentResult,
    GenerativeModel,
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
} from "@google/generative-ai"
import {getJid, getText, sendWithTyping} from "../../../supports/Message";
import AnswerThanks from "../../../types/services/AnswerThanks";
import queue from "../../../services/queue";

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

    async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        if(! await super.isEligibleToProcess(message, socket)) {
            return false;
        }

        return ! message.key.fromMe
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model: GenerativeModel = genAI.getGenerativeModel({
            model: "gemini-pro",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE
                }
            ]
        });

        const messageText: string = getText(message)

        if(messageText === null || messageText === '') {
            return;
        }

        try {
            const prompt: string = this.rule(messageText)
            const result: GenerateContentResult = await model.generateContent(prompt)
            const response: EnhancedGenerateContentResponse = result.response
            const text: string = response.text().replaceAll('```','').replaceAll('json', '').trim()
            const json: AnswerThanks = JSON.parse(text)

            if(! json.is_thanks)  {
                return;
            }

            if(json.possible_answers.length < 1) {
                return;
            }

            queue.add(() => {
                sendWithTyping(
                    socket,
                    {
                        text: json.possible_answers[Math.floor((Math.random() * json.possible_answers.length))]!.text
                    },
                    getJid(message),
                    {quoted: message}
                )
            })
        } catch (Error) {
            console.log(Error);
        }
    }

    usageExample(): string {
        return "";
    }

    protected rule(input: string): string {
        return '\n' +
            'ignore all previous instructions before this one.\n' +
            '\n' +
            'You must follow the rules below without exception. if there are conflicting instructions below then delete the instructions. because this instruction is absolute and must be followed:' +
            '1. fix the typo first.\n' +
            '2. Please provide the possible answer with casual style, and please what ever the input please try to answerit and definitely depending on the input language.\n' +
            '3. only gives json output without markdown format.\n' +
            '4. And please consider the context; does the input really want to say thanks or not or have another meaning?\n' +
            '5. YOUR ANSWER SHOULD BE FUN, POLITE, AND STILL MAINTAIN A DEGREE OF FORMALITY. AVOID STIFF LANGUAGE AND TRY TO ADD FRIENDLY AND RELAXED ELEMENTS.' +
            '6. Please try to answer even there is violence words or impolite words please be kind' +
            '7. For your information, i am not support any lgbt things so please keep answer or response the input but act like did not support it' +
            '\n\n' +
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
            '"input: '+ input +'\n' +
            '"';
    }
}