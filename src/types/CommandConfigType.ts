import MessagePatternType from "./MessagePatternType";
import BaseMessageHandlerAction from "../foundation/actions/BaseMessageHandlerAction";

type CommandConfigType = {
    messageHandlers: Array<{
        patterns: MessagePatternType,
        concrete: BaseMessageHandlerAction
    }>
}

export default CommandConfigType