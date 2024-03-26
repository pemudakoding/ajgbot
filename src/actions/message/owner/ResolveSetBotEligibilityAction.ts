import OwnerMessageHandlerAction from "../../../foundation/actions/OwnerMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str";
import {DataError} from "node-json-db";
import database from "../../../services/database";
import {getGroupId, getJid, getText, sendWithTyping} from "../../../supports/Message";
import queue from "../../../services/queue";
import Path from "../../../enums/services/Database/Path";
import Alias from "../../../enums/message/Alias";

export default class ResolveSetBotEligibilityAction extends OwnerMessageHandlerAction {
    alias: string | null = Alias.IsOnlyAdmin;
    category: string | null = null;
    description: string | null = null;

    hasArgument(): boolean {
        return true;
    }

    patterns(): MessagePatternType {
        return withSign('setonlyadmin');
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        try {
            const argument: string[] = getArguments(getText(message))
            const path: string = Path
                .Flags
                .replace(':type', 'group')
                .replace(':id', await getGroupId(message))

            if(argument[0] != 'on' && argument[0] != 'off') {
                queue.add(() => {
                    sendWithTyping(socket, {text: "hanya menerima on/off"}, getJid(message), {quoted: message})
                });

                this.reactToInvalid(message, socket)

                return;
            }

            const data: {[key: string]: boolean} = {}

            data[this.alias!] = argument[0] === 'on';

            await database.push(
                path,
                data,
                false
            )

            const text = argument[0] === 'on'
                ? "Sekarang hanya admin yang bisa menggunakan !bot!"
                : 'Sekarang semua member bisa menggunakan fitur bot!'

            queue.add(() => {
                sendWithTyping(socket, {text: text}, getJid(message), {quoted: message})

                this.reactToDone(message, socket)
            });
        } catch (error) {
            if(error instanceof DataError) {
                console.log('Belum ada groups terdata');

                return;
            }

            throw error
        }
    }

    usageExample(): string {
        return "";
    }

}