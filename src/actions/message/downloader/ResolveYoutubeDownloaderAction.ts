import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str";
import {getJid, getText, sendWithTyping} from "../../../supports/Message";
import queue from "../../../services/queue";
import Alias from "../../../enums/message/Alias";
import Category from "../../../enums/message/Category";
import CommandDescription from "../../../enums/message/CommandDescription";
import ytdl from 'ytdl-core';

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

            const info = await ytdl.getInfo(link);
            const formats = info
                .formats
                .filter(
                    (format: ytdl.videoFormat) => format.container === 'mp4' && new RegExp(/720|480|360|240|270|144/).test(format.qualityLabel) && format.hasAudio === true
                )

            const duration = parseInt(info.videoDetails.lengthSeconds) / 60 >= 1
                ? `${(parseInt(info.videoDetails.lengthSeconds) / 60).toFixed(2)} Menit`
                : `${parseInt(info.videoDetails.lengthSeconds)} Detik`

            queue.add(async () => {
                await socket.sendMessage(
                    getJid(message),
                    {
                        video: {
                            url: formats[0]!.url
                        }
                    },
                )

                queue.add(() => {
                    sendWithTyping(
                        socket,
                        {
                            text:  "Video berhasil di-proses\n\n" +
                                `Title: ${info.videoDetails.title}\n` +
                                `Duration: ${duration}\n` +
                                `Author: ${info.videoDetails.author.name}\n` +
                                `Link: ${link}`
                        },
                        getJid(message),
                        {quoted: message}
                    )
                })

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