import Category from "../enums/message/Category";
import Alias from "../enums/message/Alias";
import MessagePatternType from "./MessagePatternType";
import BaseMessageHandlerAction from "../foundation/actions/BaseMessageHandlerAction";

type MessageHandler = {
    details: {
        usage: string,
        description: string | null,
        category: Category,
        showInList: boolean,
    }
    flag: {alias: Alias, isEnabled: boolean},
    patterns: MessagePatternType,
    concrete: BaseMessageHandlerAction
}

export default MessageHandler