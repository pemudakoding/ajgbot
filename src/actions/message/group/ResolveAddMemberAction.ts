import MessagePatternType from "src/types/MessagePatternType.ts";
import {GroupMetadata, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {withSign} from "../../../supports/Str.ts";
import {getJid, isParticipantAdmin, sendWithTyping} from "../../../supports/Message.ts";
import queue from "../../../services/queue.ts";
import GroupMessageHandlerAction from "../../../foundation/actions/GroupMessageHandlerAction.ts";
import Alias from "../../../enums/message/Alias.ts";
import CommandDescription from "../../../enums/message/CommandDescription.ts";
import Category from "../../../enums/message/Category.ts";

export default class ResolveAddMemberAction extends GroupMessageHandlerAction {
    description: string = CommandDescription.AddMember
    alias: string = Alias.AddMember
    category: string = Category.Group

    public patterns(): MessagePatternType {
        return [withSign('add'), withSign('pull')];
    }

    public hasArgument(): boolean {
        return true;
    }

    public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        return await super.isEligibleToProcess(message, socket) && await isParticipantAdmin(message, socket)
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

    usageExample(): string {
        return "reply chat member yang ingin ditambahkan dengan command add";
    }
}