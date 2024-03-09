import MessagePatternType from "../../../types/MessagePatternType";
import {withSign} from "../../../supports/Str";
import {
    downloadMediaMessage, proto,
    WAMessage,
    WASocket
} from "@whiskeysockets/baileys";
import {
    downloadContentBufferFromMessage,
    getJid,
    getMessageFromViewOnce,
    getMessageQuotedCaption,
    getText, sendWithTyping
} from "../../../supports/Message";
import queue from "../../../services/queue";
import CommandDescription from "../../../enums/message/CommandDescription";
import Alias from "../../../enums/message/Alias";
import Category from "../../../enums/message/Category";
import GeminiMessageHandlerAction from "../../../foundation/actions/GeminiMessageHandlerAction";
import Gemini from "../../../services/Gemini";
import {Buffer} from "buffer";

export default class ResolveGeminiMessageAction extends GeminiMessageHandlerAction {
    public description: string | null = CommandDescription.Ai;
    public alias: string | null = Alias.Ai;
    public category: string | null = Category.Random;

    public hasArgument(): boolean {
        return true
    }

    public usageExample(): string {
        return '.ai {text}'
    }

    patterns(): MessagePatternType {
        return withSign('ai');
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        this.reactToProcessing(message, socket);

        const jid = getJid(message);
        const caption = getText(message)
            .replace(new RegExp(`^${process.env.COMMAND_SIGN}ai`), "")
            .trim();

        const viewOnce = getMessageFromViewOnce(message);
        const image = viewOnce?.imageMessage || message?.message?.imageMessage;
        const anyImage = !!image;
        const quoted = getMessageQuotedCaption(message.message!);
        const prompts: any[] = [];
        const quotedMessage = viewOnce?.extendedTextMessage?.contextInfo?.quotedMessage;

        prompts.push(caption.trim());

        await this.resolveAnyImage(anyImage, message, prompts)

        if (quoted) {
            prompts.push("\n\n\n\n\n");
            prompts.push(quoted);
        }

        if (caption.length == 0 && quoted.length == 0) {
            this.reactToInvalid(message,socket);

            return;
        }

        await this.resolveQuotedImageMessage(
            viewOnce?.extendedTextMessage?.contextInfo?.quotedMessage,
            prompts
        )

        const hasImage = anyImage || quotedMessage?.imageMessage;

        const model = Gemini
            .make()
            .setPrompts(prompts)
            .setModel(hasImage ? 'gemini-pro-vision' : 'gemini-pro')

        const response = await model.generate();

        const text = response.response.text().trim();

        queue.add(async () => {
            await sendWithTyping(
                socket,
                {
                    text: text,
                },
                jid,
                { quoted: message }
            );
            this.reactToDone(message, socket);
        });
    }

    protected pushMedia(media: Buffer, prompts: any[]): void {
        prompts.push({
            inlineData: {
                data: Buffer.from(media).toString("base64"),
                mimeType: "image/jpeg",
            },
        });
    }

    protected async resolveAnyImage(isExecute: boolean, message: WAMessage, prompts: any[]): Promise<void> {
        if (isExecute) {
            const media = (await downloadMediaMessage(
                message,
                "buffer",
                {}
            )) as Buffer;

            this.pushMedia(media, prompts)
        }
    }

    protected async resolveQuotedImageMessage(
        quotedMessage: proto.IMessage | null | undefined,
        prompts: any[]
    ): Promise<void> {
        if (quotedMessage?.imageMessage) {
            const media = await downloadContentBufferFromMessage(
                {
                    directPath: quotedMessage.imageMessage.directPath,
                    mediaKey: quotedMessage.imageMessage.mediaKey,
                    url: quotedMessage.imageMessage.url,
                },
                "image"
            );

            this.pushMedia(media, prompts)
        }
    }
}