import ResolveGroupRegistrationAction from "../../actions/message/group/ResolveGroupRegistrationAction";
import ResolveMentionAllAction from "../../actions/message/group/ResolveMentionAllAction";
import ResolveAddMemberAction from "../../actions/message/group/ResolveAddMemberAction";
import ResolveKickMemberAction from "../../actions/message/group/ResolveKickMemberAction";
import ResolveDemoteAdminAction from "../../actions/message/group/ResolveDemoteAdminAction";
import ResolvePromoteMemberAction from "../../actions/message/group/ResolvePromoteMemberAction";
import MessageHandler from "../../types/MessageHandler";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import {resolveCommandHandlerConfig} from "../../supports/Command";
import ResolveSetAntiSecretAction from "../../actions/message/group/ResolveSetAntiSecretAction";
import ResolveSetAntiBadwordAction from "../../actions/message/group/ResolveSetAntiBadwordAction";
import ResolveAddBadwordAction from "../../actions/message/group/ResolveAddBadwordAction";


const handlers: BaseMessageHandlerAction[] = [
    new ResolveGroupRegistrationAction(),
    new ResolveMentionAllAction(),
    new ResolveAddMemberAction(),
    new ResolveKickMemberAction(),
    new ResolveDemoteAdminAction(),
    new ResolvePromoteMemberAction(),
    new ResolveSetAntiSecretAction(),
    new ResolveSetAntiBadwordAction(),
    new ResolveAddBadwordAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)