import * as baileys from "@whiskeysockets/baileys"
import MessagePatternType from "../../../types/MessagePatternType.ts"
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts"
import {getArguments, withSign} from "../../../supports/Str.ts"
import {getJid, getText, react, sendWithTyping} from "../../../supports/Message.ts"
import queue from "../../../services/queue.ts"
import MediaSaver from "../../../services/mediasaver/MediaSaver.ts";
import FacebookVideoDownloaderResponse from "../../../types/services/mediasaver/FacebookVideoDownloaderResponse.ts";
import Video from "../../../types/services/mediasaver/Video.ts";

class ResolveFacebookVideoDownloaderAction extends BaseMessageHandlerAction{
    patterns(): MessagePatternType {
        return withSign('fbv')
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
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

            response
                .data
                .videos
                .map((video: Video) => {
                    if(url) {
                        return
                    }

                    url = video.url

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
                })

            queue.add(() => react(socket, '✅', message))
        } catch (error) {
            if(error.code === 'ERR_INVALID_URL') {
                queue.add(() => react(socket, '❌', message))

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