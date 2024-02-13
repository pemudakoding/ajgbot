import BraveDownData from "./BraveDownData";

type BraveDownDownloaderResponse = {
    message: string,
    success: boolean,
    data: BraveDownData | Array<unknown>
}

export default BraveDownDownloaderResponse