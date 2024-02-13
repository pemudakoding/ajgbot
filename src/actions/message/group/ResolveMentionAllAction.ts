import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {GroupParticipant, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str";
import {getJid, getParticipants, getText, sendWithTyping} from "../../../supports/Message";
import queue from "../../../services/queue";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";

class ResolveMentionAllAction extends BaseMessageHandlerAction {
    description: string = CommandDescription.MentionAll
    alias: string = Alias.MentionAll
    category: string = Category.Group

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

    usageExample(): string {
        return "*.summon* untuk mention all \n" +
            "*.summon pesan yang ingin disampaikan* untuk mention dengan pesan yang diinginkan";
    }
}

export default ResolveMentionAllAction