import MessagePatternType from "src/types/MessagePatternType.ts";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import {GroupMetadata, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str.ts";
import {getJid, getText, isGroup, isParticipantAdmin, react, sendWithTyping} from "../../../supports/Message.ts";
import queue from "../../../services/queue.ts";

export default class ResolvePromoteMemberAction extends BaseMessageHandlerAction {
    public patterns(): MessagePatternType {
        return [withSign('promote'), withSign('promosi')];
    }

    public hasArgument(): boolean {
        return true;
    }

    public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        if(! isGroup(message)) {
            return false
        }

        if(! await isParticipantAdmin(message, socket)) {
            queue.add(() => react(socket, '😡', message))
            queue.add(() => sendWithTyping(
                socket,
                { text: "Rakyat jelata dilarang memilih pejabat tidak ada demokrasi disini" },
                getJid(message),
                {quoted: message}
            ))

            return false
        }

        return true
    }

    async processAction(message: WAMessage, socket: WASocket): Promise<void> {
        const groupMetadata: GroupMetadata = await socket.groupMetadata(getJid(message))
        const members: string[] = getArguments(getText(message))
        const listOfMemberToPromote: string[] = [];

        if(members.length > 0) {
            listOfMemberToPromote.push(...members.map((member: string) => member.replace('@','').toString() + '@s.whatsapp.net'))
        }

        const participant: string | undefined | null = message.message?.extendedTextMessage?.contextInfo?.participant

        if(listOfMemberToPromote.length < 1 && Boolean(participant?.length)) {
            listOfMemberToPromote.push(participant!)
        }

        if(listOfMemberToPromote.length < 1) {
            queue.add(() => sendWithTyping(
                socket,
                { text: "tidak ada tujuan petinggi yang akan dipromosi mohon pilih petinggi terdahulu" },
            getJid(message),
                {quoted: message}
            ))

            return
        }

        socket.groupParticipantsUpdate(groupMetadata.id, listOfMemberToPromote, "promote")
    }
}