import ResolvePingAction from "../../actions/message/ResolvePingAction";
import ResolveStickerAction from "../../actions/message/ResolveStickerAction";
import MessageHandler from "../../types/MessageHandler";
import ResolveListOfCommandsAction from "../../actions/message/ResolveListOfCommandsAction";
import ResolveFeatureSynchronizeAction from "../../actions/message/ResolveFeatureSynchronizeAction";
import { resolveCommandHandlerConfig } from "../../supports/Command";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";

const handlers: BaseMessageHandlerAction[] = [
    new ResolvePingAction(),
    new ResolveStickerAction,
    new ResolveListOfCommandsAction,
    new ResolveFeatureSynchronizeAction,
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)