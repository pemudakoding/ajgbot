import ResolvePingAction from "../../actions/message/random/ResolvePingAction";
import ResolveStickerAction from "../../actions/message/random/ResolveStickerAction";
import MessageHandler from "../../types/MessageHandler";
import ResolveListOfCommandsAction from "../../actions/message/random/ResolveListOfCommandsAction";
import ResolveFeatureSynchronizeAction from "../../actions/message/random/ResolveFeatureSynchronizeAction";
import { resolveCommandHandlerConfig } from "../../supports/Command";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";

const handlers: BaseMessageHandlerAction[] = [
    new ResolvePingAction,
    new ResolveStickerAction,
    new ResolveListOfCommandsAction,
    new ResolveFeatureSynchronizeAction,
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)