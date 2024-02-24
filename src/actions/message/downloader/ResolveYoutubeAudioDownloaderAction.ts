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

export default class ResolveYoutubeAudioDownloaderAction extends BaseMessageHandlerAction {
    alias: string | null = Alias.YoutubeAudioDownload;
    category: string | null = Category.Downloader;
    description: string | null = CommandDescription.YoutubeAudioDownload;

    hasArgument(): boolean {
        return true;
    }

    patterns(): MessagePatternType {
        return withSign('ytadl');
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
            const response: YoutubeDownloaderResponse = await downloader.ytmate(YoutubeDownloaderType.audio)
            
            if(! response.success || response.data === null || ! Object.hasOwn(response.data.links[0]!, 'link')) {
                throw new DownloadFailed('audio tidak dapat di-proses karena berbagai alasan yang tidak pasti')
            }

            queue.add(async () => {
                await sendWithTyping(
                    socket,
                    {
                        audio: {
                            url: 'https://dl162.filemate22.shop/?file=M3R4SUNiN3JsOHJ6WWQ2a3NQS1Y5ZGlxVlZIOCtyZ0RsOXMweGxzQkJPQmpyWXcybk5ldkxjNEVJYUZFaHFpd0ZOQkF2aFBYWTllS1BrU2ZzNXd2VFRpTjdzUTB1aXlCL3A1ekg4OTRXaFBIaStlM25td3oyeUhzY2MzWkFMcFRLQ1ZkcmxBd2xuUzFsYlNHbnpUUTVHbjVvUm1TWnlsUy9EWWJiclBYOUpBVi9FMk5hdS8wMm9JQXVTK1M1OGNZamFERjQxYW1sZXRuL3M5OFJFRXBJTWtJajhLbm1lUGErRU1iMUE9PQ%3D%3D',
                        },
                        ptt: true,
                        mimetype: 'audio/mp4',
                    },
                    getJid(message),
                    {
                        quoted: message
                    }
                )

                this.reactToDone(message, socket)
            })

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
        return ".ytadl https://www.youtube.com/watch?v=0SC_y5X0V_I&list=RD0SC_y5X0V_I&start_radio=1";
    }

}