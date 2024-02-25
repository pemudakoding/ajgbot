import ResolveTiktokDownloaderAction from "../../actions/message/downloader/ResolveTiktokDownloaderAction";
import ResolveInstagramDownloaderAction from "../../actions/message/downloader/ResolveInstagramDownloaderAction";
import ResolveFacebookVideoDownloaderAction from "../../actions/message/downloader/ResolveFacebookVideoDownloaderAction";
import ResolveTikTokAudioDownloaderAction from "../../actions/message/downloader/ResolveTikTokAudioDownloaderAction";
import MessageHandler from "../../types/MessageHandler";
import ResolveInstagramAudioDownloaderAction from "../../actions/message/downloader/ResolveInstagramAudioDownloaderAction";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import {resolveCommandHandlerConfig} from "../../supports/Command";
import ResolveYoutubeDownloaderAction from "../../actions/message/downloader/ResolveYoutubeDownloaderAction";
import ResolveYoutubeAudioDownloaderAction from "../../actions/message/downloader/ResolveYoutubeAudioDownloaderAction";
import ResolveTwitterDownloaderAction from "../../actions/message/downloader/ResolveTwitterDownloaderAction";

const handlers: BaseMessageHandlerAction[] = [
    new ResolveTiktokDownloaderAction(),
    new ResolveTikTokAudioDownloaderAction(),
    new ResolveInstagramDownloaderAction(),
    new ResolveInstagramAudioDownloaderAction(),
    new ResolveFacebookVideoDownloaderAction(),
    new ResolveYoutubeDownloaderAction(),
    new ResolveYoutubeAudioDownloaderAction(),
    new ResolveTwitterDownloaderAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)