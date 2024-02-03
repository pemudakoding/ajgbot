import Category from "../enums/message/Category.ts";
import Alias from "../enums/message/Alias.ts";
import MessagePatternType from "./MessagePatternType.ts";
import BaseMessageHandlerAction from "../foundation/actions/BaseMessageHandlerAction.ts";

type MessageHandler = {
    details: {
        usage: string,
        description: string,
        category: Category
    }
    flag: {alias: Alias, isEnabled: boolean},
    patterns: MessagePatternType,
    concrete: BaseMessageHandlerAction
}

export default MessageHandler