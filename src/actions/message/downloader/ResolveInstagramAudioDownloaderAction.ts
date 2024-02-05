import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../../types/MessagePatternType.ts";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import {getArguments, withSign} from "../../../supports/Str.ts";
import {getJid, getText, sendWithTyping} from "../../../supports/Message.ts";
import queue from "../../../services/queue.ts";
import MediaSaver from "../../../services/mediasaver/MediaSaver.ts";
import Alias from "../../../enums/message/Alias.ts";
import CommandDescription from "../../../enums/message/CommandDescription.ts";
import Category from "../../../enums/message/Category.ts";
import SavetubeDownloaderType from "../../../enums/services/mediasaver/SavetubeDownloaderType.ts";
import SavetubeInstagramAudioResponse from "../../../types/services/mediasaver/SavetubeInstagramAudioResponse.ts";

class ResolveInstagramAudioDownloaderAction extends BaseMessageHandlerAction{
    description: string = CommandDescription.InstagramAudioDownloader
    alias: string = Alias.InstagramAudioDownloader
    category: string = Category.Downloader

    patterns(): MessagePatternType {
        return [withSign('iga'), withSign('igaudio')]
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        try {
            await this.reactToProcessing(message, socket)

            const link: string | undefined = getArguments(getText(message))[0]

            if(link === undefined) {
                throw Error('Pakailah URL Instagram Bung!!!')
            }

            new URL(link)

            const downloader: MediaSaver = new MediaSaver(link)

            const instagramDownloader: SavetubeInstagramAudioResponse = await downloader.saveTube(SavetubeDownloaderType.audio)

            if(instagramDownloader.data === null) {
                throw new Error("Video diprivasi atau tidak ditemukan")
            }

            queue.add(async () => {
                await sendWithTyping(
                    socket,
                    {
                        audio: {url: instagramDownloader.data!.url},
                        mimetype: "audio/mp4"
                    },
                    getJid(message)
                )

                this.reactToDone(message, socket)
            })

        } catch (Error) {
            if(Error.code === 'ERR_INVALID_URL') {
                this.reactToInvalid(message, socket)

                queue.add(() => sendWithTyping(
                    socket,
                    { text: "pakai link instagram yang valid kanda!!!" },
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
        return ".iga https://www.instagram.com/reels/C2Qs2oxSEwT/";
    }
}

export default ResolveInstagramAudioDownloaderAction