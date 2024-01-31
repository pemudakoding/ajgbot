import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import MessagePatternType from "../../../types/MessagePatternType.ts";
import {GroupParticipant, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str.ts";
import {getJid, getText, sendWithTyping} from "../../../supports/Message.ts";
import queue from "../../../services/queue.ts";

class ResolveMentionAllAction extends BaseMessageHandlerAction {
    hasArgument(): boolean {
        return true;
    }

    patterns(): MessagePatternType {
        return withSign('sumon');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isEligibleToProcess(message: WAMessage, socket: WASocket): boolean {
        return Boolean(message.key.participant);
    }

    async sendMessage(message: WAMessage, socket: WASocket): Promise<void> {
        const texts: string[] = getArguments(getText(message))
        const groupMetaData = await socket.groupMetadata(message.key.remoteJid!)
        const participants: string[] = groupMetaData
            .participants
            .map((participant: GroupParticipant) => participant.id)
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