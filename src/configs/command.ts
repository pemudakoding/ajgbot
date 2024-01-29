import ResolvePingAction from "../actions/message/ResolvePingAction";
import CommandConfigType from "../types/CommandConfigType";
import ResolveTiktokDownloaderAction from "../actions/message/ResolveTiktokDownloaderAction.ts";

export default <CommandConfigType> {
    messageHandlers: [
        {
            patterns: (new ResolvePingAction()).patterns(),
            concrete: new ResolvePingAction()
        },
        {
            patterns: (new ResolveTiktokDownloaderAction()).patterns(),
            concrete: new ResolveTiktokDownloaderAction()
        }
    ]
}