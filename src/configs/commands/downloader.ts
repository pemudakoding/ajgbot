import ResolveTiktokDownloaderAction from "../../actions/message/downloader/ResolveTiktokDownloaderAction";
import ResolveInstagramDownloaderAction from "../../actions/message/downloader/ResolveInstagramDownloaderAction";
import ResolveFacebookVideoDownloaderAction from "../../actions/message/downloader/ResolveFacebookVideoDownloaderAction";
import ResolveTikTokAudioDownloaderAction from "../../actions/message/downloader/ResolveTikTokAudioDownloaderAction";
import MessageHandler from "../../types/MessageHandler";
import ResolveInstagramAudioDownloaderAction from "../../actions/message/downloader/ResolveInstagramAudioDownloaderAction";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import {resolveCommandHandlerConfig} from "../../supports/Command";

const handlers: BaseMessageHandlerAction[] = [
    new ResolveTiktokDownloaderAction(),
    new ResolveTikTokAudioDownloaderAction(),
    new ResolveInstagramDownloaderAction(),
    new ResolveInstagramAudioDownloaderAction(),
    new ResolveFacebookVideoDownloaderAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)