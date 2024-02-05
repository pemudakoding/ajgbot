import ResolveTiktokDownloaderAction from "../../actions/message/downloader/ResolveTiktokDownloaderAction.ts";
import ResolveInstagramDownloaderAction from "../../actions/message/downloader/ResolveInstagramDownloaderAction.ts";
import ResolveFacebookVideoDownloaderAction from "../../actions/message/downloader/ResolveFacebookVideoDownloaderAction.ts";
import ResolveTikTokAudioDownloaderAction from "../../actions/message/downloader/ResolveTikTokAudioDownloaderAction.ts";
import MessageHandler from "../../types/MessageHandler.ts";
import ResolveInstagramAudioDownloaderAction
    from "../../actions/message/downloader/ResolveInstagramAudioDownloaderAction.ts";

export default <MessageHandler[]> [
    {
        details: {
            usage: (new ResolveTiktokDownloaderAction()).usageExample(),
            description: (new ResolveTiktokDownloaderAction()).description,
            category: (new ResolveTiktokDownloaderAction()).category,
        },
        flag: {
            alias: (new ResolveTiktokDownloaderAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveTiktokDownloaderAction()).patterns(),
        concrete: new ResolveTiktokDownloaderAction()
    },
    {
        details: {
            usage: (new ResolveInstagramDownloaderAction()).usageExample(),
            description: (new ResolveInstagramDownloaderAction()).description,
            category: (new ResolveInstagramDownloaderAction()).category,
        },
        flag: {
            alias: (new ResolveInstagramDownloaderAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveInstagramDownloaderAction()).patterns(),
        concrete: new ResolveInstagramDownloaderAction()
    },
    {
        details: {
            usage: (new ResolveInstagramAudioDownloaderAction()).usageExample(),
            description: (new ResolveInstagramAudioDownloaderAction()).description,
            category: (new ResolveInstagramAudioDownloaderAction()).category,
        },
        flag: {
            alias: (new ResolveInstagramAudioDownloaderAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveInstagramAudioDownloaderAction()).patterns(),
        concrete: new ResolveInstagramAudioDownloaderAction()
    },
    {
        details: {
            usage: (new ResolveFacebookVideoDownloaderAction()).usageExample(),
            description: (new ResolveFacebookVideoDownloaderAction()).description,
            category: (new ResolveFacebookVideoDownloaderAction()).category,
        },
        flag: {
            alias: (new ResolveFacebookVideoDownloaderAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveFacebookVideoDownloaderAction()).patterns(),
        concrete: new ResolveFacebookVideoDownloaderAction()
    },
    {
        details: {
            usage: (new ResolveTikTokAudioDownloaderAction()).usageExample(),
            description: (new ResolveTikTokAudioDownloaderAction()).description,
            category: (new ResolveTikTokAudioDownloaderAction()).category,
        },
        flag: {
            alias: (new ResolveTikTokAudioDownloaderAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveTikTokAudioDownloaderAction()).patterns(),
        concrete: new ResolveTikTokAudioDownloaderAction()
    }
]