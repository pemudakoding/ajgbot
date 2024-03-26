import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import ResolveFeatureSynchronizeAction from "../../actions/message/owner/ResolveFeatureSynchronizeAction";
import MessageHandler from "../../types/MessageHandler";
import {resolveCommandHandlerConfig} from "../../supports/Command";
import ResolveBroadcastToGroupsAction from "../../actions/message/owner/ResolveBroadcastToGroupsAction";
import ResolveSetBotEligibilityAction from "../../actions/message/owner/ResolveSetBotEligibilityAction";

const handlers: BaseMessageHandlerAction[] = [
    new ResolveFeatureSynchronizeAction(),
    new ResolveBroadcastToGroupsAction(),
    new ResolveSetBotEligibilityAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)