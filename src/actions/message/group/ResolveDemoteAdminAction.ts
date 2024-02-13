import MessagePatternType from "src/types/MessagePatternType";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import {GroupMetadata, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str";
import {getJid, getText, isParticipantAdmin, sendWithTyping} from "../../../supports/Message";
import queue from "../../../services/queue";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";

export default class ResolveDemoteAdminAction extends BaseMessageHandlerAction {
    description: string = CommandDescription.DemoteMember
    alias: string = Alias.DemoteMember
    category: string = Category.Group

    public patterns(): MessagePatternType {
        return [withSign('demote'), withSign('kudeta')];
    }

    public hasArgument(): boolean {
        return true;
    }

    public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        if(! await super.isEligibleToProcess(message, socket)) {
            return false
        }

        if(! await isParticipantAdmin(message, socket)) {
            this.reactToInvalid(message, socket)

            queue.add(() => sendWithTyping(
                socket,
                { text: "Rakyat jelata dilarang mengikuti proses kudeta kekuasaan" },
                getJid(message),
                {quoted: message}
            ))

            return false
        }

        return true
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        const groupMetadata: GroupMetadata = await socket.groupMetadata(getJid(message))
        const members: string[] = getArguments(getText(message))
        const listOfAdminsToDemote: string[] = [];

        if(members.length > 0) {
            listOfAdminsToDemote.push(...members.map((member: string) => member.replace('@','').toString() + '@s.whatsapp.net'))
        }

        const participant: string | undefined | null = message.message?.extendedTextMessage?.contextInfo?.participant

        if(listOfAdminsToDemote.length < 1 && Boolean(participant?.length)) {
            listOfAdminsToDemote.push(participant!)
        }

        if(listOfAdminsToDemote.length < 1) {
            queue.add(() => sendWithTyping(
                socket,
                { text: "tidak ada tujuan petinggi yang akan dikudeta mohon pilih petinggi terdahulu" },
            getJid(message),
                {quoted: message}
            ))

            return
        }

        socket.groupParticipantsUpdate(groupMetadata.id, listOfAdminsToDemote, "demote")
    }

    usageExample(): string {
        return ".demote @admin1 @admin2\n atau" +
            "reply admin yang ingin didemote dengan command demote";
    }
}