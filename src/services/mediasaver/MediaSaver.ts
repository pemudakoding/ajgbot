import Blueprint from "../../enums/services/mediasaver/Blueprint";
import FacebookVideoDownloaderResponse from "../../types/services/mediasaver/FacebookVideoDownloaderResponse";
import TiktokDownloaderResponse from "../../types/services/mediasaver/TiktokDownloaderResponse";
import BraveDownDownloaderType from "../../enums/services/mediasaver/BraveDownDownloaderType";
import BraveDownDownloaderResponse from "../../types/services/mediasaver/BraveDownDownloaderResponse";
import SavetubeDownloaderType from "../../enums/services/mediasaver/SavetubeDownloaderType";
import SavetubeInstagramAudioResponse from "../../types/services/mediasaver/SavetubeInstagramAudioResponse";
import YoutubeDownloaderResponse from "../../types/services/mediasaver/YoutubeDownloaderResponse";
import YoutubeDownloaderType from "../../enums/services/mediasaver/YoutubeDownloaderType";

export default class MediaSaver {
    private readonly baseUrl: string = 'https://mediasaver.binsarjr.com/services'
    private readonly identifier: string

    constructor(identifier: string) {
        this.identifier = identifier
    }

    public async fDownloader(): Promise<FacebookVideoDownloaderResponse> {
        const response: Response = await fetch(this.baseUrl + Blueprint.Fdownloader + '?url=' + this.identifier)

        return response.json()
    }

    public async snaptik(): Promise<TiktokDownloaderResponse> {
        const response: Response = await fetch(this.baseUrl + Blueprint.Snaptik + '?url=' + this.identifier)

        return response.json()
    }

    public async braveDown(downloader: BraveDownDownloaderType): Promise<BraveDownDownloaderResponse> {
        const response: Response = await fetch(this.baseUrl + Blueprint.BraveDown + downloader + '?url=' + this.identifier)

        return response.json()
    }

    public async saveTube(downloader: SavetubeDownloaderType): Promise<SavetubeInstagramAudioResponse> {
        const response: Response = await fetch(this.baseUrl + Blueprint.Savetube + downloader + '?identifier=' + this.identifier)

        return response.json()
    }

    public async ytmate(downloader: YoutubeDownloaderType): Promise<YoutubeDownloaderResponse> {
        const response: Response = await fetch(this.baseUrl + Blueprint.Yt2mate + downloader + '?url=' + this.identifier)

        return response.json()
    }
}