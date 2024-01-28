import {WASocket} from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import {WAMessage} from "@whiskeysockets/baileys/lib/Types/Message";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import {withSign} from "../../supports/Str";
import {getJid} from "../../supports/Message";

class ResolvePingAction extends BaseMessageHandlerAction{
    patterns(): MessagePatternType {
        return withSign('ping')
    }

    async sendMessage(message: WAMessage, socket: WASocket): Promise<void> {
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
}

export default ResolvePingAction