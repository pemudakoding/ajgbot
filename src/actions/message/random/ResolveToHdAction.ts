import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../../types/MessagePatternType";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import {withSign} from "../../../supports/Str";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";
import {Buffer} from "buffer";
import {downloadMessageMedia, downloadQuotedMessageMedia, getJid} from "../../../supports/Message";
import fs, {PathOrFileDescriptor} from "fs";
import axios from "axios";
import queue from "../../../services/queue";

class ResolveToHdAction extends BaseMessageHandlerAction{
    description: string = CommandDescription.ToHd
    alias: string = Alias.ToHd
    category: string = Category.Random

    private tempImgPath: string = './static/temp-img/'

    patterns(): MessagePatternType {
        return withSign('tohd')
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        this.reactToProcessing(message, socket)

        let photoBuffer: Buffer | null = null;
        let photoPath: string | null | Buffer | import("stream").Transform = null;
        const imagePath: string = this.tempImgPath + message.key.id! + '.jpeg'

        switch (true) {
            case Boolean(message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage):
                photoPath = await downloadQuotedMessageMedia(message.message?.extendedTextMessage?.contextInfo?.quotedMessage, imagePath);
                photoBuffer = fs.readFileSync(photoPath)
                break
            case Boolean(message?.message?.imageMessage):
                photoPath = await downloadMessageMedia(message!, socket, imagePath);
                photoBuffer = fs.readFileSync(photoPath as PathOrFileDescriptor)
                break
            default: return
        }

        const data = new FormData()
            data.append('image', new Blob([photoBuffer], { type: 'image/jpeg' }))
            data.append('scale', '2')

        const response = await axios.post(
            'https://api2.pixelcut.app/image/upscale/v1',
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Accept-Encoding': 'application/json',
                    'Accept': 'application/json',
                }
            }
        )

        queue.add(() => {
            socket.sendMessage(
                getJid(message),
                {
                    image: {
                        url: response.data.result_url
                    },
                    caption: 'Gambar berhasil di-process menjadi HD'
                },
            )

            this.reactToDone(message, socket)
        })
    }

    hasArgument(): boolean {
        return false
    }

    usageExample(): string {
        return ".tohd";
    }
}

export default ResolveToHdAction