import ResolvePingAction from "../actions/message/ResolvePingAction";
import CommandConfigType from "../types/CommandConfigType";
import ResolveTiktokDownloaderAction from "../actions/message/downloader/ResolveTiktokDownloaderAction.ts";
import ResolveInstagramDownloaderAction from "../actions/message/downloader/ResolveInstagramDownloaderAction.ts";
import ResolveFacebookVideoDownloaderAction
    from "../actions/message/downloader/ResolveFacebookVideoDownloaderAction.ts";

export default <CommandConfigType> {
    messageHandlers: [
        {
            patterns: (new ResolvePingAction()).patterns(),
            concrete: new ResolvePingAction()
        },
        {
            patterns: (new ResolveTiktokDownloaderAction()).patterns(),
            concrete: new ResolveTiktokDownloaderAction()
        },
        {
            patterns: (new ResolveInstagramDownloaderAction()).patterns(),
            concrete: new ResolveInstagramDownloaderAction()
        },
        {
            patterns: (new ResolveFacebookVideoDownloaderAction()).patterns(),
            concrete: new ResolveFacebookVideoDownloaderAction()
        }
    ]
}