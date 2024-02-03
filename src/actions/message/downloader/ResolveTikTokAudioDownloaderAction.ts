import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import MessagePatternType from "../../../types/MessagePatternType.ts";
import {getArguments, withSign} from "../../../supports/Str.ts";
import * as baileys from "@whiskeysockets/baileys";
import {getJid, getText, sendWithTyping} from "../../../supports/Message.ts";
import MediaSaver from "../../../services/mediasaver/MediaSaver.ts";
import queue from "../../../services/queue.ts";
import BraveDownDownloaderType from "../../../enums/services/mediasaver/BraveDownDownloaderType.ts";
import BraveDownDownloaderResponse from "../../../types/services/mediasaver/BraveDownDownloaderResponse.ts";
import BraveDownData from "../../../types/services/mediasaver/BraveDownData.ts";
import Alias from "../../../enums/message/Alias.ts";
import CommandDescription from "../../../enums/message/CommandDescription.ts";
import Category from "../../../enums/message/Category.ts";

export default class ResolveTikTokAudioDownloaderAction extends BaseMessageHandlerAction {
    description: string = CommandDescription.TiktokAudioDownloader
    alias: string = Alias.TiktokAudioDownloader
    category: string = Category.Downloader

    patterns(): MessagePatternType {
        return [withSign('tiktokaudio'), withSign('ta')]
    }

    hasArgument(): boolean {
        return true
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            await this.reactToProcessing(message, socket)

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

                    queue.add(async () => {
                        await sendWithTyping(
                            socket,
                            {
                                audio: {url: link.url},
                                mimetype: 'audio/mp4'
                            },
                            getJid(message),
                            {quoted: message}
                        )

                        queue.add(() => this.reactToDone(message,socket))
                    })
                })
            }
        } catch (Error) {
            if(Error.code === 'ERR_INVALID_URL') {
                this.reactToInvalid(message, socket)
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

    usageExample(): string {
        return ".ta https://tiktok.com/balgaba";
    }
}