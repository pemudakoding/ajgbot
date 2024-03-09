import BaseMessageHandlerAction from "./BaseMessageHandlerAction";
import * as baileys from "@whiskeysockets/baileys";
import {patternsAndTextIsMatch} from "../../supports/Str";
import queue from "../../services/queue";
import {getJid, sendWithTyping} from "../../supports/Message";

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
            if(
                Error
                    .toString()
                    .includes("[500 Internal Server Error] An internal error has occurred. ")
            ) {
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