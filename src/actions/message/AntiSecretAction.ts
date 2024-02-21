import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../types/MessagePatternType";
import {downloadMediaMessage, proto, WAMessage, WASocket} from "@whiskeysockets/baileys";
import Alias from "../../enums/message/Alias";
import {Buffer} from "buffer";
import queue from "../../services/queue";
import {getJid, sendWithTyping} from "../../supports/Message";

export default class AntiSecretAction extends BaseMessageHandlerAction {
    alias: string | null = Alias.AntiSecret;
    category: string | null = null;
    description: string | null = null;
    showInList: boolean = false;

    hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        return true;
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {

        const viewOnceMessage: proto.Message.IFutureProofMessage | null | undefined =
            message.message?.viewOnceMessage ||
            message.message?.viewOnceMessageV2 ||
            message.message?.viewOnceMessageV2Extension;

        const isViewOnce: boolean = !!viewOnceMessage;

        if(! isViewOnce) {
            return;
        }
        
        const image: proto.Message.IImageMessage | null | undefined = viewOnceMessage?.message?.imageMessage;
        const video: proto.Message.IVideoMessage | null | undefined = viewOnceMessage?.message?.videoMessage;
        const caption: string | null | undefined = image?.caption || video?.caption;

        let text: string  = `*View Once Message Revealed*\n`;

        if (caption) {
            text += `Caption: ${caption}\n`;
        }

        const media: Buffer | import("stream").Transform = await downloadMediaMessage(message, "buffer", {});

        text = text.trim();

        if(image) {
            queue.add(() => sendWithTyping(
                    socket,
                    {image: media as Buffer, caption: text},
                    getJid(message),
                    {quoted: message}
                )
            )

            return;
        }

        if(video) {
            queue.add(() => sendWithTyping(
                    socket,
                    {video: media as Buffer, caption: text},
                    getJid(message),
                    {quoted: message}
                )
            )

            return;
        }
    }

    usageExample(): string {
        return "";
    }

}