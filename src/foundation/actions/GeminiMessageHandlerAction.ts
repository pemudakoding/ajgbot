import BaseMessageHandlerAction from "./BaseMessageHandlerAction";
import * as baileys from "@whiskeysockets/baileys";
import {patternsAndTextIsMatch} from "../../supports/Str";
import queue from "../../services/queue";
import {getJid, sendWithTyping} from "../../supports/Message";
import {GoogleGenerativeAIError} from "@google/generative-ai/dist/src/errors";

export default abstract class GeminiMessageHandlerAction extends BaseMessageHandlerAction {
    public async execute(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            if(! patternsAndTextIsMatch(this.patterns(), message)) {
                return;
            }

            if(! await this.isEligibleToProcess(message, socket)) {
                return;
            }

            await this.process(message, socket)
        } catch (Error) {
            if(Error instanceof GoogleGenerativeAIError) {
                this.reactToFailed(message,socket)

                queue.add(() => sendWithTyping(
                    socket,
                    { text: 'Bot tidak dapat memproses AI untuk saat ini silahkan coba lagi beberapa detik kedepan' },
                    getJid(message),
                    {
                        quoted: message
                    }
                ))
            }
            if (
                Error
                    .toString()
                    .includes("The model is overloaded. Please try again later.")
            ) {
                queue.add(() => this.execute(message, socket));
                return;
            }

            this.reactToFailed(message,socket)

            queue.add(() => sendWithTyping(
                socket,
                { text: Error.message },
                getJid(message),
                {
                    quoted: message
                }
            ))
        }
    }
}