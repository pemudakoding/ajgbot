import * as baileys from "@whiskeysockets/baileys"
import MessagePatternType from "../../../types/MessagePatternType.ts"
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts"
import {getArguments, withSign} from "../../../supports/Str.ts"
import {getJid, getText, react, sendWithTyping} from "../../../supports/Message.ts"
import queue from "../../../services/queue.ts"
import { InstagramService } from "@xncn/instagramdownloaderpro";
import DownloadResponse from "@xncn/instagramdownloaderpro/dist/response/DownloadResponse";

class ResolveInstagramDownloaderAction extends BaseMessageHandlerAction{
    patterns(): MessagePatternType {
        return withSign('ig')
    }

    async processAction(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            const links: string[] = getArguments(getText(message))

            if(links.length < 1) {
                throw Error('Pakailah URL Instagram Bung!!!')
            }
            const link: string | undefined = links[0]

            if(! link) {
                throw Error('bot lagi tidak bisa memproses')
            }

            new URL(link)

            const urls: (string | undefined)[] = await this.download(link)

            urls.map((url: string): void => {
                const isImage = /(webp|jpg)/
                if(isImage.test(url)) {
                    queue.add(() => sendWithTyping(
                        socket,
                        {
                            image: {
                                url: url,
                            },
                            caption: "ini gambarnya, bilang apa? \n\n" + link
                        },
                        getJid(message),
                        {
                            quoted: message
                        }
                    ))

                    return
                }

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
        } catch (Error) {
            if(Error.code === 'ERR_INVALID_URL') {
                queue.add(() => react(socket, '😡', message))

                queue.add(() => sendWithTyping(
                    socket,
                    { text: "pakai link Instagram yang valid kanda!!!" },
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

    private async download(link: string): Promise<(string|undefined)[]> {
        const instagram = new InstagramService()

        const medias: DownloadResponse[] = await instagram.downloadService.Download(link)

        return medias.map((media: DownloadResponse) => media.url)
    }
}

export default ResolveInstagramDownloaderAction