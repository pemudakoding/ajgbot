import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import Alias from "../../../enums/message/Alias";
import Category from "../../../enums/message/Category";
import CommandDescription from "../../../enums/message/CommandDescription";
import {getArguments, withSign} from "../../../supports/Str";
import {getJid, getText, sendWithTyping} from "../../../supports/Message";
import MediaSaver from "../../../services/mediasaver/MediaSaver";
import queue from "../../../services/queue";
import BraveDownDownloaderResponse from "../../../types/services/mediasaver/BraveDownDownloaderResponse";
import BraveDownDownloaderType from "../../../enums/services/mediasaver/BraveDownDownloaderType";
import DownloadFailed from "../../../exceptions/DownloadFailed";
import BraveDownData from "../../../types/services/mediasaver/BraveDownData";

export default class ResolveTwitterDownloaderAction extends BaseMessageHandlerAction {
    alias: string | null = Alias.TwitterDownloader;
    category: string | null = Category.Downloader;
    description: string | null = CommandDescription.TwitterDownloader;

    hasArgument(): boolean {
        return true;
    }

    patterns(): MessagePatternType {
        return withSign('tdl');
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        try {
            await this.reactToProcessing(message, socket)

            const link: string | undefined = getArguments(getText(message))[0]

            if(link === undefined) {
                throw Error('Pakailah URL Twitter Bung!!!')
            }

            new URL(link)

            const downloader: MediaSaver = new MediaSaver(link)

            const response: BraveDownDownloaderResponse = await downloader.braveDown(BraveDownDownloaderType.TwitterDownloader)
            const promises = [];

            if(! Object.hasOwn(response.data, 'title')) {
                throw new DownloadFailed('Video tidak dapat diproses, tidak ditemukan atau mungkin ter-privasi.')
            }

            const data: BraveDownData = response.data as BraveDownData
            const links = data.links.filter((link) => ! RegExp('^1080').test(link.quality as unknown as string))

            promises.push(
                queue.add(() => socket.sendMessage(
                    getJid(message),
                    {
                        video: {
                            url: links[links.length - 1]!.url,
                        },
                    },
                ))
            )

            Promise.any(promises).then(() => {
                queue.add(() => {
                    sendWithTyping(
                        socket,
                        {
                            text: "Permintaan berhasil di proses \n\n" +
                                `${'Title: ' + data.title}\n`+
                                `${'Link: ' + link}`
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
                    { text: "pakai link twitter yang valid kanda!!!" },
                    getJid(message)
                ))

                return
            }

            throw Error
        }
    }

    usageExample(): string {
        return ".tdl https://twitter.com/username/status/1761389938418041033";
    }

}