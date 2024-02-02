import Blueprint from "../../enums/services/mediasaver/Blueprint.ts";
import FacebookVideoDownloaderResponse from "../../types/services/mediasaver/FacebookVideoDownloaderResponse.ts";
import TiktokDownloaderResponse from "../../types/services/mediasaver/TiktokDownloaderResponse.ts";

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
}