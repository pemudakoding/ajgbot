import MessagePatternType from "src/types/MessagePatternType.ts";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import {GroupMetadata, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str.ts";
import {getJid, getText, isParticipantAdmin, sendWithTyping} from "../../../supports/Message.ts";
import queue from "../../../services/queue.ts";
import Alias from "../../../enums/message/Alias.ts";

export default class ResolveKickMemberAction extends BaseMessageHandlerAction {
    alias: string = Alias.KickMember

    public patterns(): MessagePatternType {
        return [withSign('rm'), withSign('kick')];
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
                { text: "yang bukan admin jangan banyak gaya mau kick-kick member :)" },
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
        const listOfMemberToKick: string[] = [];

        if(members.length > 0) {
            listOfMemberToKick.push(...members.map((member: string) => member.replace('@','').toString() + '@s.whatsapp.net'))
        }

        const participant: string | undefined | null = message.message?.extendedTextMessage?.contextInfo?.participant

        if(listOfMemberToKick.length < 1 && Boolean(participant?.length)) {
            listOfMemberToKick.push(participant!)
        }

        if(listOfMemberToKick.length < 1) {
            queue.add(() => sendWithTyping(
                socket,
                { text: "tidak ada member yang perlu dikick" },
            getJid(message),
                {quoted: message}
            ))

            return
        }

        socket.groupParticipantsUpdate(groupMetadata.id, listOfMemberToKick, "remove")
    }
}