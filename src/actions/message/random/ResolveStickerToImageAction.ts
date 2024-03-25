import { WAMessage, type WASocket } from "@whiskeysockets/baileys";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.js";
import {withSign} from "../../../supports/Str";
import {Buffer} from "buffer";
import {downloadContentBufferFromMessage, getJid} from "../../../supports/Message";
import Alias from "../../../enums/message/Alias";
import Category from "../../../enums/message/Category";
import CommandDescription from "../../../enums/message/CommandDescription";

export default class ResolveStickerToImageAction extends BaseMessageHandlerAction {
    alias: string | null = Alias.StickerToImage;
    category: string | null = Category.Random;
    description: string | null = CommandDescription.StickerToImage;

    hasArgument(): boolean {
        return false;
    }

    patterns() {
        return [withSign("simg")];
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        this.reactToProcessing(message, socket);

        let photoBuffer: Buffer | null = null;

        switch (true) {
            case Boolean(message.message?.extendedTextMessage?.contextInfo?.quotedMessage):
            {
                const directPath =
                    message.message?.extendedTextMessage?.contextInfo?.quotedMessage
                        ?.stickerMessage?.directPath;
                const mediaKey =
                    message.message?.extendedTextMessage?.contextInfo?.quotedMessage
                        ?.stickerMessage?.mediaKey;
                const url =
                    message.message?.extendedTextMessage?.contextInfo?.quotedMessage
                        ?.stickerMessage?.url;
                photoBuffer = await downloadContentBufferFromMessage(
                    {
                        directPath,
                        mediaKey,
                        url,
                    },
                    "image"
                );
            }
                break;
            case Boolean(message?.message?.stickerMessage):
            {
                const directPath = message?.message?.stickerMessage?.directPath;
                const mediaKey = message?.message?.stickerMessage?.mediaKey;
                const url = message?.message?.stickerMessage?.url;
                photoBuffer = await downloadContentBufferFromMessage(
                    {
                        directPath,
                        mediaKey,
                        url,
                    },
                    "image"
                );
            }
                break;
            default:
                this.reactToInvalid(message, socket);

                return;
        }

        if (!photoBuffer) {
            this.reactToInvalid(message, socket);
            return;
        }

        await socket.sendMessage(
            getJid(message),
            {
                image: photoBuffer,
            },
            {
                quoted: message,
            }
        );
        await this.reactToDone(message, socket);
    }

    usageExample(): string {
        return ".simg (reply sticker)";
    }
}