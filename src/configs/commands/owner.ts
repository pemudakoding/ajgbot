import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import ResolveFeatureSynchronizeAction from "../../actions/message/owner/ResolveFeatureSynchronizeAction";
import MessageHandler from "../../types/MessageHandler";
import {resolveCommandHandlerConfig} from "../../supports/Command";

const handlers: BaseMessageHandlerAction[] = [
    new ResolveFeatureSynchronizeAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)