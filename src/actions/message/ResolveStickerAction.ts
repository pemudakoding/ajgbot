import MessagePatternType from "src/types/MessagePatternType.ts";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction.ts";
import {
    WAMessage,
    WASocket
} from "@whiskeysockets/baileys";
import {withSign} from "../../supports/Str.ts";
import {downloadMessageMedia, downloadQuotedMessageMedia, getJid, getText} from "../../supports/Message.ts";
import * as fs from "fs";
import {Sticker, StickerTypes} from "wa-sticker-formatter";
import queue from "../../services/queue.ts";
import {Buffer} from "buffer";
import telegraph from "../../services/telegraph.ts";


export default class ResolveStickerAction extends BaseMessageHandlerAction {
    private tempImgPath: string = './static/temp-img/'

    public patterns(): MessagePatternType {
        return [withSign('s'), withSign('sticker')]
    }
    public hasArgument(): boolean {
        return true
    }

    async process(message: WAMessage, socket: WASocket) {
        let photoBuffer: Buffer | null = null;
        let photoPath: string | null = null;
        const imagePath: string = this.tempImgPath + message.key.id! + '.jpeg'

        switch (true) {

            case Boolean(message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage):
                photoPath = await downloadQuotedMessageMedia(message.message?.extendedTextMessage?.contextInfo?.quotedMessage, imagePath);
                photoBuffer = fs.readFileSync(photoPath)
                break
            case Boolean(message?.message?.imageMessage):
                photoPath = await downloadMessageMedia(message!, socket, imagePath);
                photoBuffer = fs.readFileSync(photoPath)
                break
            default: return
        }

        const photo: string | Buffer = await this.processStickerText(message, photoBuffer)

        const sticker: Sticker = this.prepareSticker(photo)

        queue.add(async () => {
            socket.sendMessage(
                getJid(message),
                await sticker.toMessage(),
                {
                    quoted: message
                }
            )

            fs.unlink(photoPath!, () => {})
        })
    }

    protected prepareSticker(photo: string | Buffer): Sticker {
        return new Sticker(photo)
            .setPack('Majelis Anak Anjing')
            .setAuthor('Majelis Anak Anjing')
            .setType(StickerTypes.FULL)
    }


    protected async processStickerText(message: WAMessage, defaultPhoto: Buffer): Promise<string|Buffer> {
        const text: string = getText(message)
        const commandArguments = text.match(/\.(.*?) ((.*?)$)/)

        if(! commandArguments)  {
            return defaultPhoto;
        }

        if(! commandArguments!.length) {
            return defaultPhoto
        }

        const [top, bottom] = commandArguments[commandArguments.length - 1]!.split('|')
        const imageLink: string = await telegraph(defaultPhoto)

        return "https://api.memegen.link/images/custom/" + encodeURIComponent(top ? top.substring(0,20) : '_') + "/" + encodeURIComponent(bottom ? bottom.substring(0,20) : '_') + ".png?background=" + imageLink
    }
}