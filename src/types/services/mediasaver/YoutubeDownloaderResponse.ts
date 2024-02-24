import YoutubeLinks from "./YoutubeLinks";

type YoutubeDownloaderResponse = {
    message: string,
    success: boolean,
    data: {
        title: string,
        duration: string,
        thumbnail: string,
        links: YoutubeLinks[]
    } | null
}

export type {YoutubeDownloaderResponse as default}