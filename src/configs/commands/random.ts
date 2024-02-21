import ResolvePingAction from "../../actions/message/ResolvePingAction";
import ResolveStickerAction from "../../actions/message/ResolveStickerAction";
import MessageHandler from "../../types/MessageHandler";
import ResolveListOfCommandsAction from "../../actions/message/ResolveListOfCommandsAction";
import ResolveFeatureSynchronizeAction from "../../actions/message/ResolveFeatureSynchronizeAction";
import { resolveCommandHandlerConfig } from "../../supports/Command";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import SetAntiSecretAction from "../../actions/message/SetAntiSecretAction";

const handlers: BaseMessageHandlerAction[] = [
    new ResolvePingAction,
    new ResolveStickerAction,
    new ResolveListOfCommandsAction,
    new ResolveFeatureSynchronizeAction,
    new SetAntiSecretAction,
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)