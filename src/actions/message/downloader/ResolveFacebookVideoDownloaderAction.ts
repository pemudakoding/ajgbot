import * as baileys from "@whiskeysockets/baileys"
import MessagePatternType from "../../../types/MessagePatternType.ts"
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts"
import {getArguments, withSign} from "../../../supports/Str.ts"
import {getJid, getText, sendWithTyping} from "../../../supports/Message.ts"
import queue from "../../../services/queue.ts"
import MediaSaver from "../../../services/mediasaver/MediaSaver.ts";
import FacebookVideoDownloaderResponse from "../../../types/services/mediasaver/FacebookVideoDownloaderResponse.ts";
import Video from "../../../types/services/mediasaver/Video.ts";
import Alias from "../../../enums/message/Alias.ts";

class ResolveFacebookVideoDownloaderAction extends BaseMessageHandlerAction{
    alias: string = Alias.FacebookDownloader

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

}

export default ResolveFacebookVideoDownloaderAction