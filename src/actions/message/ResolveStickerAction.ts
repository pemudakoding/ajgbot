import MessagePatternType from "src/types/MessagePatternType";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import {
    WAMessage,
    WASocket
} from "@whiskeysockets/baileys";
import {withSign} from "../../supports/Str";
import {downloadMessageMedia, downloadQuotedMessageMedia, getJid, getText} from "../../supports/Message";
import * as fs from "fs";
import {Sticker, StickerTypes} from "wa-sticker-formatter";
import queue from "../../services/queue";
import {Buffer} from "buffer";
import telegraph from "../../services/telegraph";
import Alias from "../../enums/message/Alias";
import CommandDescription from "../../enums/message/CommandDescription";
import Category from "../../enums/message/Category";
import {PathLike, PathOrFileDescriptor} from "fs";


export default class ResolveStickerAction extends BaseMessageHandlerAction {
    description: string = CommandDescription.Sticker
    alias: string = Alias.Sticker
    category: string = Category.Random

    private tempImgPath: string = './static/temp-img/'

    public patterns(): MessagePatternType {
        return [withSign('s'), withSign('sticker'), withSign('stiker')]
    }
    public hasArgument(): boolean {
        return true
    }

    async process(message: WAMessage, socket: WASocket) {
        this.reactToProcessing(message, socket)

        let photoBuffer: Buffer | null = null;
        let photoPath: string | null | Buffer | import("stream").Transform = null;
        const imagePath: string = this.tempImgPath + message.key.id! + '.jpeg'

        switch (true) {

            case Boolean(message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage):
                photoPath = await downloadQuotedMessageMedia(message.message?.extendedTextMessage?.contextInfo?.quotedMessage, imagePath);
                photoBuffer = fs.readFileSync(photoPath)
                break
            case Boolean(message?.message?.imageMessage) && typeof photoPath === 'string' :
                photoPath = await downloadMessageMedia(message!, socket, imagePath);
                photoBuffer = fs.readFileSync(photoPath as PathOrFileDescriptor)
                break
            default: return
        }

        const photo: string | Buffer = await this.processStickerText(message, photoBuffer)

        const sticker: Sticker = this.prepareSticker(photo)

        queue.add(async () => {
            await socket.sendMessage(
                getJid(message),
                await sticker.toMessage(),
                {
                    quoted: message
                }
            )

            fs.unlink(photoPath as PathLike, () => {})

            this.reactToDone(message, socket)
        })
    }

    usageExample(): string {
        return "membuat sticker tanpa text .sticker \n" +
            "membuat sticker text atas *.sticker text atas* \n" +
            "membuat sticker text bawah *.sticker |text bawah*\n" +
            "membuat sticker text atas bawah *.sticker text atas|text bawah*";
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