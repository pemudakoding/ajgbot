import ResolvePingAction from "../../actions/message/random/ResolvePingAction";
import ResolveStickerAction from "../../actions/message/random/ResolveStickerAction";
import MessageHandler from "../../types/MessageHandler";
import ResolveListOfCommandsAction from "../../actions/message/random/ResolveListOfCommandsAction";
import ResolveFeatureSynchronizeAction from "../../actions/message/owner/ResolveFeatureSynchronizeAction";
import { resolveCommandHandlerConfig } from "../../supports/Command";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import ResolveGeminiMessageAction from "../../actions/message/random/ResolveGeminiMessageAction";
import ResolveToHdAction from "../../actions/message/random/ResolveToHdAction";
import ResolveStickerToImageAction from "../../actions/message/random/ResolveStickerToImageAction";
import ResolveCheckKhodamAction from "../../actions/message/random/ResolveCheckKhodamAction";

const handlers: BaseMessageHandlerAction[] = [
    new ResolvePingAction(),
    new ResolveStickerAction(),
    new ResolveListOfCommandsAction(),
    new ResolveFeatureSynchronizeAction(),
    new ResolveGeminiMessageAction(),
    new ResolveToHdAction(),
    new ResolveStickerToImageAction(),
    new ResolveCheckKhodamAction(),
];

export default <MessageHandler[]> resolveCommandHandlerConfig(handlers)