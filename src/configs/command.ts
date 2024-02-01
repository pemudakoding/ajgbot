import ResolvePingAction from "../actions/message/ResolvePingAction";
import CommandConfigType from "../types/CommandConfigType";
import ResolveTiktokDownloaderAction from "../actions/message/downloader/ResolveTiktokDownloaderAction.ts";
import ResolveInstagramDownloaderAction from "../actions/message/downloader/ResolveInstagramDownloaderAction.ts";
import ResolveFacebookVideoDownloaderAction from "../actions/message/downloader/ResolveFacebookVideoDownloaderAction.ts";
import ResolveMentionAllAction from "../actions/message/group/ResolveMentionAllAction.ts";
import ResolveAddMemberAction from "../actions/message/group/ResolveAddMemberAction.ts";
import ResolveKickMemberAction from "../actions/message/group/ResolveKickMemberAction.ts";
import ResolveDemoteAdminAction from "../actions/message/group/ResolveDemoteAdminAction.ts";
import ResolvePromoteMemberAction from "../actions/message/group/ResolvePromoteMemberAction.ts";
import ResolveStickerAction from "../actions/message/ResolveStickerAction.ts";

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
        },
        {
            patterns: (new ResolveMentionAllAction()).patterns(),
            concrete: new ResolveMentionAllAction()
        },
        {
            patterns: (new ResolveAddMemberAction()).patterns(),
            concrete: new ResolveAddMemberAction()
        },
        {
            patterns: (new ResolveKickMemberAction()).patterns(),
            concrete: new ResolveKickMemberAction()
        },
        {
            patterns: (new ResolveDemoteAdminAction()).patterns(),
            concrete: new ResolveDemoteAdminAction()
        },
        {
            patterns: (new ResolvePromoteMemberAction()).patterns(),
            concrete: new ResolvePromoteMemberAction()
        },
        {
            patterns: (new ResolveStickerAction()).patterns(),
            concrete: new ResolveStickerAction()
        }
    ]
}