import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction";
import {withSign} from "../../supports/Str";
import {getJid} from "../../supports/Message";
import Alias from "../../enums/message/Alias.ts";

class ResolvePingAction extends BaseMessageHandlerAction{
    alias: string = Alias.Ping

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
}

export default ResolvePingAction