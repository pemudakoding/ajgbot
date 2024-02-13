import * as baileys from "@whiskeysockets/baileys"
import MessagePatternType from "../../../types/MessagePatternType"
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction"
import {getArguments, withSign} from "../../../supports/Str"
import {getJid, getText, sendWithTyping} from "../../../supports/Message"
import queue from "../../../services/queue"
import MediaSaver from "../../../services/mediasaver/MediaSaver";
import FacebookVideoDownloaderResponse from "../../../types/services/mediasaver/FacebookVideoDownloaderResponse";
import Video from "../../../types/services/mediasaver/Video";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";

class ResolveFacebookVideoDownloaderAction extends BaseMessageHandlerAction{
    description: string = CommandDescription.FacebookVideoDownloader
    alias: string = Alias.FacebookDownloader
    category: string = Category.Downloader

    patterns(): MessagePatternType {
        return withSign('fbv')
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            await this.reactToProcessing(message, socket)

            const links: string[] = getArguments(getText(message))

            if(links.length < 1) {
                throw Error('Pakailah URL Facebook Bung!!!')
            }
            const link: string | undefined = links[0]

            if(! link) {
                throw Error('bot lagi tidak bisa memproses')
            }

            new URL(link)

            const downloader: MediaSaver = new MediaSaver(link)
            const response: FacebookVideoDownloaderResponse = await downloader.facebookVideo()
            let url: string | URL

            if(! response.success) {
                throw Error('Video gagal diproses, video mungkin bersifat pribadi atau tidak ada')
            }

            const promises: Promise<unknown>[]  = []

            response
                .data
                .videos
                .map((video: Video) => {
                    if(url) {
                        return
                    }

                    url = video.url

                    promises.push(
                        queue.add(() => sendWithTyping(
                            socket,
                            {
                                video: {
                                    url: url,
                                },
                                caption: "ini videonya, bilang apa? \n\n" + link
                            },
                            getJid(message),
                            {
                                quoted: message
                            }
                        ))
                    )
                })

            Promise.any(promises).then(() => this.reactToDone(message, socket))
        } catch (error) {
            if(error.code === 'ERR_INVALID_URL') {
                this.reactToInvalid(message, socket)

                queue.add(() => sendWithTyping(
                    socket,
                    { text: "pakai link Facebook yang valid kanda!!!" },
                    getJid(message)
                ))

                return
            }

            throw error
        }
    }

    hasArgument(): boolean {
        return true
    }

    usageExample(): string {
        return ".fbv https://facebook.conm/watch/balgaba";
    }
}

export default ResolveFacebookVideoDownloaderAction