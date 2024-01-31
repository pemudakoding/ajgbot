import Video from "./Video.ts";

type FacebookVideoDownloaderResponse = {
    message: string,
    success: boolean,
    data: {
        videos: Video[]
    }
}

export default FacebookVideoDownloaderResponse