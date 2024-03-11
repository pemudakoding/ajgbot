import MessagePatternType from "src/types/MessagePatternType";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getTextAfterSign, withSign} from "../../../supports/Str";
import {getJid, getText, isParticipantAdmin, sendWithTyping} from "../../../supports/Message";
import queue from "../../../services/queue";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";
import AddBadwordAction from "../../database/AddBadwordAction";

export default class ResolveAddBadwordAction extends BaseMessageHandlerAction {
    description: string = CommandDescription.AddBadword
    alias: string = Alias.AddBadword
    category: string = Category.Group

    public patterns(): MessagePatternType {
        return [withSign('addbadword')];
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
                { text: "yang bukan admin jangan banyak gaya" },
                getJid(message),
                {quoted: message}
            ))

            return false
        }

        return true
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        const badwords: string[] = getTextAfterSign(getText(message), this.patterns()!).split(',')

        if(badwords.length < 1) {
            queue.add(() => sendWithTyping(
                socket,
                { text: "tidak ada badword yang perlu ditambahkan silahkan tambahkan kata kata yang ingin di blacklist" },
            getJid(message),
                {quoted: message}
            ))

            return
        }

        queue.add(() => sendWithTyping(
            socket,
            { text: "Sukses menambahkan badword baru " + badwords.join(',')},
            getJid(message),
            {quoted: message}
        ))

        AddBadwordAction.execute(badwords)
    }

    usageExample(): string {
        return ".addbadword dandi,fikri";
    }
}