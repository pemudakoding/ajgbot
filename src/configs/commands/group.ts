import ResolveGroupRegistrationAction from "../../actions/message/group/ResolveGroupRegistrationAction.ts";
import ResolveMentionAllAction from "../../actions/message/group/ResolveMentionAllAction.ts";
import ResolveAddMemberAction from "../../actions/message/group/ResolveAddMemberAction.ts";
import ResolveKickMemberAction from "../../actions/message/group/ResolveKickMemberAction.ts";
import ResolveDemoteAdminAction from "../../actions/message/group/ResolveDemoteAdminAction.ts";
import ResolvePromoteMemberAction from "../../actions/message/group/ResolvePromoteMemberAction.ts";
import MessageHandler from "../../types/MessageHandler.ts";

export default <MessageHandler[]> [
    {
        details: {
            usage: (new ResolveGroupRegistrationAction()).usageExample(),
            description: (new ResolveGroupRegistrationAction()).description,
            category: (new ResolveGroupRegistrationAction()).category,
        },
        flag: {
            alias: (new ResolveGroupRegistrationAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveGroupRegistrationAction()).patterns(),
        concrete: new ResolveGroupRegistrationAction()
    },
    {
        details: {
            usage: (new ResolveMentionAllAction()).usageExample(),
            description: (new ResolveMentionAllAction()).description,
            category: (new ResolveMentionAllAction()).category,
        },
        flag: {
            alias: (new ResolveMentionAllAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveMentionAllAction()).patterns(),
        concrete: new ResolveMentionAllAction()
    },
    {
        details: {
            usage: (new ResolveAddMemberAction()).usageExample(),
            description: (new ResolveAddMemberAction()).description,
            category: (new ResolveAddMemberAction()).category,
        },
        flag: {
            alias: (new ResolveAddMemberAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveAddMemberAction()).patterns(),
        concrete: new ResolveAddMemberAction()
    },
    {
        details: {
            usage: (new ResolveKickMemberAction()).usageExample(),
            description: (new ResolveKickMemberAction()).description,
            category: (new ResolveKickMemberAction()).category,
        },
        flag: {
            alias: (new ResolveKickMemberAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveKickMemberAction()).patterns(),
        concrete: new ResolveKickMemberAction()
    },
    {
        details: {
            usage: (new ResolveDemoteAdminAction()).usageExample(),
            description: (new ResolveDemoteAdminAction()).description,
            category: (new ResolveDemoteAdminAction()).category,
        },
        flag: {
            alias: (new ResolveDemoteAdminAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolveDemoteAdminAction()).patterns(),
        concrete: new ResolveDemoteAdminAction()
    },
    {
        details: {
            usage: (new ResolvePromoteMemberAction()).usageExample(),
            description: (new ResolvePromoteMemberAction()).description,
            category: (new ResolvePromoteMemberAction()).category,
        },
        flag: {
            alias: (new ResolvePromoteMemberAction()).alias,
            isEnabled: true
        },
        patterns: (new ResolvePromoteMemberAction()).patterns(),
        concrete: new ResolvePromoteMemberAction()
    },
]