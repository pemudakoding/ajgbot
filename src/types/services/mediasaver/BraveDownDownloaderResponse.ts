import BraveDownData from "./BraveDownData";

type BraveDownDownloaderResponse = {
    message: string,
    success: boolean,
    data: BraveDownData | Array<undefined>
}

export default BraveDownDownloaderResponse