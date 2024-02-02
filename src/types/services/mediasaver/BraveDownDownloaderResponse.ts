import BraveDownData from "./BraveDownData.ts";

type BraveDownDownloaderResponse = {
    message: string,
    success: boolean,
    data: BraveDownData | Array<unknown>
}

export default BraveDownDownloaderResponse