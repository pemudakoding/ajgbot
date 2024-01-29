import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import {withSign} from "../../supports/Str";
import {getJid} from "../../supports/Message";

class ResolvePingAction extends BaseMessageHandlerAction{
    patterns(): MessagePatternType {
        return [withSign('ping'), withSign('test')]
    }

    async sendMessage(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
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
}

export default ResolvePingAction