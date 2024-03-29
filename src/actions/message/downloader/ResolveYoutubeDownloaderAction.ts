import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str";
import {getJid, getText, sendWithTyping} from "../../../supports/Message";
import MediaSaver from "../../../services/mediasaver/MediaSaver";
import queue from "../../../services/queue";
import YoutubeDownloaderResponse from "../../../types/services/mediasaver/YoutubeDownloaderResponse";
import DownloadFailed from "../../../exceptions/DownloadFailed";
import Alias from "../../../enums/message/Alias";
import Category from "../../../enums/message/Category";
import CommandDescription from "../../../enums/message/CommandDescription";
import YoutubeDownloaderType from "../../../enums/services/mediasaver/YoutubeDownloaderType";
import {Buffer} from "buffer";

export default class ResolveYoutubeDownloaderAction extends BaseMessageHandlerAction {
    alias: string | null = Alias.YoutubeDownload;
    category: string | null = Category.Downloader;
    description: string | null = CommandDescription.YoutubeDownload;

    hasArgument(): boolean {
        return true;
    }

    patterns(): MessagePatternType {
        return withSign('ytdl');
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        try {
            await this.reactToProcessing(message, socket)

            const link: string | undefined = getArguments(getText(message))[0]

            if(link === undefined) {
                throw Error('Pakailah URL Youtube Bung!!!')
            }

            new URL(link)

            const downloader: MediaSaver = new MediaSaver(link)
            const response: YoutubeDownloaderResponse = await downloader.ytmate(YoutubeDownloaderType.video)

            if(! response.success || response.data === null || ! Object.hasOwn(response.data.links[0]!, 'link')) {
                throw new DownloadFailed('Video tidak dapat di-proses karena berbagai alasan yang tidak pasti')
            }

            const buffer: ArrayBuffer = await (await fetch(response.data?.links[0]!.link as string)).arrayBuffer()

            queue.add(async () => {
                await sendWithTyping(
                    socket,
                    {
                        video: Buffer.from(buffer),
                        caption: "ini videonya, bilang apa?\n\n" +
                            `title: ${response.data?.title}\n` +
                            `duration: ${response.data?.duration}\n` +
                            `link: ${link}`
                    },
                    getJid(message),
                    {
                        quoted: message
                    }
                )

                this.reactToDone(message, socket)
            })

        } catch (Error) {
            console.log(Error)
            if(Error.code === 'ERR_INVALID_URL') {
                this.reactToInvalid(message, socket)

                queue.add(() => sendWithTyping(
                    socket,
                    { text: "pakai link youtube yang valid kanda!!!" },
                    getJid(message)
                ))

                return
            }

            if(Error.name === 'download_failed') {
                this.reactToFailed(message, socket)

                queue.add(() => sendWithTyping(
                    socket,
                    { text: Error.message },
                    getJid(message)
                ))

                return
            }

            throw Error
        }
    }

    usageExample(): string {
        return ".ytdl https://www.youtube.com/watch?v=0SC_y5X0V_I&list=RD0SC_y5X0V_I&start_radio=1";
    }

}