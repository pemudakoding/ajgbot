type BraveDownData = {
    source: string,
    title: string,
    thumbnail: URL,
    duration: string,
    links: {
        url: URL,
        type: 'audio' | 'video',
        file: 'mp4' | 'mp3',
        quality: string,
        mute: boolean,
    }[]
}

export default BraveDownData