import Blueprint from "../../enums/services/mediasaver/Blueprint.ts";
import FacebookVideoDownloaderResponse from "../../types/services/mediasaver/FacebookVideoDownloaderResponse.ts";
import TiktokDownloaderResponse from "../../types/services/mediasaver/TiktokDownloaderResponse.ts";
import BraveDownDownloaderType from "../../enums/services/mediasaver/BraveDownDownloaderType.ts";
import BraveDownDownloaderResponse from "../../types/services/mediasaver/BraveDownDownloaderResponse.ts";

export default class MediaSaver {
    private readonly baseUrl: string = 'https://mediasaver.binsarjr.com/services'
    private readonly link: string

    constructor(link: string) {
        this.link = link
    }

    public async facebookVideo(): Promise<FacebookVideoDownloaderResponse> {
        const response: Response = await fetch(this.baseUrl + Blueprint.Fdownloader + '?url=' + this.link)

        return response.json()
    }

    public async tiktok(): Promise<TiktokDownloaderResponse> {
        const response: Response = await fetch(this.baseUrl + Blueprint.Snaptik + '?url=' + this.link)

        return response.json()
    }

    public async braveDown(downloader: BraveDownDownloaderType): Promise<BraveDownDownloaderResponse> {
        const response: Response = await fetch(this.baseUrl + Blueprint.BraveDown + downloader + '?url=' + this.link)

        return response.json()
    }
}