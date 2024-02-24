import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../../types/MessagePatternType";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import {getArguments, withSign} from "../../../supports/Str";
import {getJid, getText, sendWithTyping} from "../../../supports/Message";
import queue from "../../../services/queue";
import MediaSaver from "../../../services/mediasaver/MediaSaver";
import TiktokDownloaderResponse from "../../../types/services/mediasaver/TiktokDownloaderResponse";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";

class ResolveTiktokDownloaderAction extends BaseMessageHandlerAction{
    description: string = CommandDescription.TiktokDownloader
    alias: string = Alias.TiktokDownloader
    category: string = Category.Downloader

    patterns(): MessagePatternType {
        return [withSign('tt'), withSign('vt')]
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

            const tiktokDownload: TiktokDownloaderResponse = await downloader.snaptik()
            const promises = [];

            if(tiktokDownload.video !== '') {
                promises.push(
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
                )
            }

            tiktokDownload.images.map((image: string) => {
                promises.push(
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
                )
            })

            Promise.any(promises).then(() => this.reactToDone(message, socket))
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

    hasArgument(): boolean {
        return true
    }

    usageExample(): string {
        return ".tt https://tiktok.com/balgaba";
    }
}

export default ResolveTiktokDownloaderAction