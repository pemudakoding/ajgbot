import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import MessagePatternType from "../../../types/MessagePatternType.ts";
import {getArguments, withSign} from "../../../supports/Str.ts";
import * as baileys from "@whiskeysockets/baileys";
import {getJid, getText, react, sendWithTyping} from "../../../supports/Message.ts";
import MediaSaver from "../../../services/mediasaver/MediaSaver.ts";
import queue from "../../../services/queue.ts";
import BraveDownDownloaderType from "../../../enums/services/mediasaver/BraveDownDownloaderType.ts";
import BraveDownDownloaderResponse from "../../../types/services/mediasaver/BraveDownDownloaderResponse.ts";
import BraveDownData from "../../../types/services/mediasaver/BraveDownData.ts";

export default class ResolveTikTokAudioDownloaderAction extends BaseMessageHandlerAction {
    patterns(): MessagePatternType {
        return [withSign('tiktokaudio'), withSign('ta')]
    }

    hasArgument(): boolean {
        return true
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            const link: string | undefined = getArguments(getText(message))[0]

            if(link === undefined) {
                throw Error('Pakailah URL Tiktok Bung!!!')
            }

            new URL(link)

            const downloader: MediaSaver = new MediaSaver(link)
            const tiktokDownload: BraveDownDownloaderResponse = await downloader.braveDown(BraveDownDownloaderType.TikTokDownloader)

            if(Array.isArray(tiktokDownload.data) && tiktokDownload.data.length === 0) {
                throw Error('Video tidak ditemukan atau kemungkinan bot lagi error')
            }

            if("source" in tiktokDownload.data && tiktokDownload) {
                const { links }: BraveDownData = tiktokDownload.data

                links.map((link) => {
                    if(link.type === 'video') {
                        return;
                    }

                    console.log(link)
                    queue.add(() => sendWithTyping(
                        socket,
                        {
                            audio: {url: link.url},
                            mimetype: 'audio/mp4'
                        },
                        getJid(message),
                        {quoted: message}
                    ))


                    queue.add(() => react(socket, '✅', message))
                })
            }
        } catch (Error) {
            if(Error.code === 'ERR_INVALID_URL') {
                queue.add(() => react(socket, '😡', message))
                queue.add(() => sendWithTyping(
                    socket,
                    { text: "pakai link tiktok yang valid kanda!!!" },
                    getJid(message)
                ))

                return
            }

            throw Error
        }
    }
}