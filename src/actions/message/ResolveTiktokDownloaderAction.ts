import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import {getArguments, withSign} from "../../supports/Str";
import {getJid, getText, react, sendWithTyping} from "../../supports/Message";
import queue from "../../services/queue.ts";

class ResolveTiktokDownloaderAction extends BaseMessageHandlerAction{
    patterns(): MessagePatternType {
        return [withSign('tt'), withSign('vt')]
    }

    async sendMessage(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            const link: string | undefined = getArguments(getText(message))[0]

            if(link === undefined) {
                throw Error('Pakailah URL Tiktok Bung!!!')
            }

            new URL(link)

            const tiktokDownload: {video: string, images: string[]} = await this.download(link)

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
            queue.add(() => react(socket, '😡', message))

            if(Error.code === 'ERR_INVALID_URL') {
                queue.add(() => sendWithTyping(
                    socket,
                    { text: "pakai link tiktok yang valid kanda!!!" },
                    getJid(message)
                ))

                return
            }

            queue.add(() => sendWithTyping(
                socket,
                { text: Error.message },
                getJid(message)
            ))
        }
    }

    hasArgument(): boolean {
        return true
    }

    private async download(link: string): Promise<{video: string, images: string[]}> {
        const response: Response = await fetch('https://mediasaver.vercel.app/services/tiktok/snaptik?url=' + link)

        return await response.json()
    }
}

export default ResolveTiktokDownloaderAction