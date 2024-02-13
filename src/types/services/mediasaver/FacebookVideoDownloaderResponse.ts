import Video from "./Video";

type FacebookVideoDownloaderResponse = {
    message: string,
    success: boolean,
    data: {
        videos: Video[]
    }
}

export default FacebookVideoDownloaderResponse