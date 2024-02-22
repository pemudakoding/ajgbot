import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../../types/MessagePatternType";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import {withSign} from "../../../supports/Str";
import {getJid} from "../../../supports/Message";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";

class ResolvePingAction extends BaseMessageHandlerAction{
    description: string = CommandDescription.Ping
    alias: string = Alias.Ping
    category: string = Category.Random

    patterns(): MessagePatternType {
        return [withSign('ping'), withSign('test')]
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        await socket.sendMessage(
            getJid(message),
            {
                text: 'pong!'
            },
            {
                quoted: message
            }
        )
    }

    hasArgument(): boolean {
        return false
    }

    usageExample(): string {
        return ".ping";
    }
}

export default ResolvePingAction