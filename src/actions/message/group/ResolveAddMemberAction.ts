import MessagePatternType from "src/types/MessagePatternType.ts";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction.ts";
import {GroupMetadata, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {withSign} from "../../../supports/Str.ts";
import {getJid, isGroup, isParticipantAdmin, sendWithTyping} from "../../../supports/Message.ts";
import queue from "../../../services/queue.ts";

export default class ResolveAddMemberAction extends BaseMessageHandlerAction {
    public patterns(): MessagePatternType {
        return [withSign('add'), withSign('pull')];
    }

    public hasArgument(): boolean {
        return true;
    }

    public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        return isGroup(message) && await isParticipantAdmin(message, socket)
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        const groupMetadata: GroupMetadata = await socket.groupMetadata(getJid(message))
        const participant: string | undefined | null = message.message?.extendedTextMessage?.contextInfo?.participant

        if(participant?.length) {
            socket.groupParticipantsUpdate(groupMetadata.id, [participant], "add")

            return;
        }

        queue.add(() => sendWithTyping(
            socket,
            { text: "Reply chat member yang ingin ditambahkan" },
            getJid(message),
            {quoted: message}
        ))

        return
    }
}