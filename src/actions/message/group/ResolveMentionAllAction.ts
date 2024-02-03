import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import MessagePatternType from "../../../types/MessagePatternType.ts";
import {GroupParticipant, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str.ts";
import {getJid, getParticipants, getText, sendWithTyping} from "../../../supports/Message.ts";
import queue from "../../../services/queue.ts";
import Alias from "../../../enums/message/Alias.ts";

class ResolveMentionAllAction extends BaseMessageHandlerAction {
    alias: string = Alias.MentionAll

    hasArgument(): boolean {
        return true;
    }

    patterns(): MessagePatternType {
        return [withSign('summon'), withSign('kuchiyose'), withSign('tagall')];
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        const texts: string[] = getArguments(getText(message))
        const groupMetaData: GroupParticipant[] = await getParticipants(socket, getJid(message))
        const participants: string[] = groupMetaData.map((participant: GroupParticipant) => participant.id)
        const text: string = texts.length < 1 ? "yo wazzup" : texts.join(" ")

        queue.add(() => sendWithTyping(
            socket,
            {
                text,
                mentions: participants
            },
            getJid(message),
        ))
    }
}

export default ResolveMentionAllAction