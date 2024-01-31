import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../../types/MessagePatternType.ts";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import {getArguments, withSign} from "../../../supports/Str.ts";
import {getJid, getText, react, sendWithTyping} from "../../../supports/Message.ts";
import queue from "../../../services/queue.ts";
import MediaSaver from "../../../services/mediasaver/MediaSaver.ts";
import TiktokDownloaderResponse from "../../../types/services/mediasaver/TiktokDownloaderResponse.ts";

class ResolveTiktokDownloaderAction extends BaseMessageHandlerAction{
    patterns(): MessagePatternType {
        return [withSign('tt'), withSign('vt')]
    }

    async processAction(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            const link: string | undefined = getArguments(getText(message))[0]

            if(link === undefined) {
                throw Error('Pakailah URL Tiktok Bung!!!')
            }

            new URL(link)

            const downloader: MediaSaver = new MediaSaver(link)

            const tiktokDownload: TiktokDownloaderResponse = await downloader.tiktok()

            if(tiktokDownload.video !== '') {
                queue.add(() => sendWithTyping(
                    socket,
                    {
                        video: {
                            url: tiktokDownload.video,
                        },
                        caption: "ini videonya, bilang apa? \n\n" + link
                    },
                    getJid(message),
                    {
                        quoted: message
                    }
                ))
            }

            tiktokDownload.images.map((image: string) => {
                queue.add(() => sendWithTyping(
                    socket,
                    {
                        image: {
                            url: image,
                        },
                        caption: "ini gambarnya, bilang apa? \n\n" + link
                    },
                    getJid(message),
                    {
                        quoted: message
                    }
                ))
            })

            queue.add(() => react(socket, '✅', message))
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

    hasArgument(): boolean {
        return true
    }
}

export default ResolveTiktokDownloaderAction