export default class DownloadFailed extends Error {
    constructor(message: string) {
        super();

        this.message = message
        this.name = 'download_failed'
    }
}