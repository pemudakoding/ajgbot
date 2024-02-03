import MessagePatternType from "./MessagePatternType";
import BaseMessageHandlerAction from "../foundation/actions/BaseMessageHandlerAction";
import Alias from "../enums/message/Alias.ts";

type CommandConfigType = {
    messageHandlers: Array<{
        flag: {alias: Alias, isEnabled: boolean},
        patterns: MessagePatternType,
        concrete: BaseMessageHandlerAction
    }>
}

export default CommandConfigType