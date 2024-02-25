import * as baileys from "@whiskeysockets/baileys"
import MessagePatternType from "../../../types/MessagePatternType"
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction"
import {getArguments, withSign} from "../../../supports/Str"
import {getJid, getText, sendWithTyping} from "../../../supports/Message"
import queue from "../../../services/queue"
import { InstagramService } from "@xncn/instagramdownloaderpro";
import DownloadResponse from "@xncn/instagramdownloaderpro/dist/response/DownloadResponse";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";

class ResolveInstagramDownloaderAction extends BaseMessageHandlerAction{
    description: string = CommandDescription.InstagramDownloader
    alias: string = Alias.InstagramDownloader
    category: string = Category.Downloader

    patterns(): MessagePatternType {
        return withSign('ig')
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            await this.reactToProcessing(message, socket)

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
            const promises: Promise<unknown>[] = []
            let totalImage: number = 0;
            let totalVideo: number = 0;

            urls.map((url: string): void => {
                const isImage = /(webp|jpg)/
                if(isImage.test(url)) {
                    totalImage++

                    promises.push(
                        queue.add(() => sendWithTyping(
                            socket,
                            {
                                image: {
                                    url: url,
                                },
                            },
                            getJid(message),
                        ))
                    )

                    return
                }

                totalVideo++

                promises.push(
                    queue.add(() => sendWithTyping(
                        socket,
                        {
                            video: {
                                url: url,
                            },
                        },
                        getJid(message),
                    ))
                )
            })

            promises.push(

            )

            Promise.any(promises).then(() => {
                queue.add(() => {
                    sendWithTyping(
                        socket,
                        {
                            text: "Permintaan berhasil di proses \n\n" +
                                `${totalImage > 0 ? 'Total Gambar: ' + totalImage + '\n': ''}` +
                                `${totalVideo > 0 ? 'Total Video: ' + totalVideo + '\n': ''}` +
                                `${'Link:' + link}`
                        },
                        getJid(message),
                        {quoted: message}
                    )
                })

                this.reactToDone(message,socket)
            })
        } catch (Error) {
            if(Error.code === 'ERR_INVALID_URL') {
                this.reactToInvalid(message, socket)

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

    usageExample(): string {
        return ".ig https://instagram.conm/reels/balgaba";
    }

    private async download(link: string): Promise<(string|undefined)[]> {
        const instagram = new InstagramService()

        const medias: DownloadResponse[] = await instagram.downloadService.Download(link)

        return medias.map((media: DownloadResponse) => media.url)
    }
}

export default ResolveInstagramDownloaderAction