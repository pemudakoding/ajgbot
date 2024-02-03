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
import ResolveTikTokAudioDownloaderAction from "../actions/message/downloader/ResolveTikTokAudioDownloaderAction.ts";
import ResolveGroupRegistrationAction from "../actions/message/group/ResolveGroupRegistrationAction.ts";

export default <CommandConfigType> {
    messageHandlers: [
        {
            flag: {
                alias: (new ResolvePingAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolvePingAction()).patterns(),
            concrete: new ResolvePingAction()
        },
        {
            flag: {
                alias: (new ResolveTiktokDownloaderAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveTiktokDownloaderAction()).patterns(),
            concrete: new ResolveTiktokDownloaderAction()
        },
        {
            flag: {
                alias: (new ResolveInstagramDownloaderAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveInstagramDownloaderAction()).patterns(),
            concrete: new ResolveInstagramDownloaderAction()
        },
        {
            flag: {
                alias: (new ResolveFacebookVideoDownloaderAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveFacebookVideoDownloaderAction()).patterns(),
            concrete: new ResolveFacebookVideoDownloaderAction()
        },
        {
            flag: {
                alias: (new ResolveMentionAllAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveMentionAllAction()).patterns(),
            concrete: new ResolveMentionAllAction()
        },
        {
            flag: {
                alias: (new ResolveAddMemberAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveAddMemberAction()).patterns(),
            concrete: new ResolveAddMemberAction()
        },
        {
            flag: {
                alias: (new ResolveKickMemberAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveKickMemberAction()).patterns(),
            concrete: new ResolveKickMemberAction()
        },
        {
            flag: {
                alias: (new ResolveDemoteAdminAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveDemoteAdminAction()).patterns(),
            concrete: new ResolveDemoteAdminAction()
        },
        {
            flag: {
                alias: (new ResolvePromoteMemberAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolvePromoteMemberAction()).patterns(),
            concrete: new ResolvePromoteMemberAction()
        },
        {
            flag: {
                alias: (new ResolveStickerAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveStickerAction()).patterns(),
            concrete: new ResolveStickerAction()
        },
        {
            flag: {
                alias: (new ResolveTikTokAudioDownloaderAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveTikTokAudioDownloaderAction()).patterns(),
            concrete: new ResolveTikTokAudioDownloaderAction()
        },
        {
            flag: {
                alias: (new ResolveGroupRegistrationAction()).alias,
                isEnabled: true
            },
            patterns: (new ResolveGroupRegistrationAction()).patterns(),
            concrete: new ResolveGroupRegistrationAction()
        }
    ]
}