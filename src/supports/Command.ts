
import MessageHandler from "../types/MessageHandler";
import BaseMessageHandlerAction from "../foundation/actions/BaseMessageHandlerAction";
import Category from "../enums/message/Category";
import Alias from "../enums/message/Alias";

const resolveCommandHandlerConfig = (handlers: BaseMessageHandlerAction[]): MessageHandler[] => handlers
    .map((handler: BaseMessageHandlerAction): MessageHandler => ({
        details: {
            usage: handler.usageExample(),
            description: handler.description,
            category: handler.category as Category,
            showInList: handler.showInList
        },
        flag: {
            alias: handler.alias as Alias,
            isEnabled: true
        },
        patterns: handler.patterns(),
        concrete: handler
    }))

export {
    resolveCommandHandlerConfig
}