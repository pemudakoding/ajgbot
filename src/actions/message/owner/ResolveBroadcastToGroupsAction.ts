import OwnerMessageHandlerAction from "../../../foundation/actions/OwnerMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {withSign} from "../../../supports/Str";
import {DataError} from "node-json-db";
import database from "../../../services/database";
import {getTextWithoutCommand, sendWithTyping} from "../../../supports/Message";
import queue from "../../../services/queue";
import {wait} from "@hapi/hoek";

export default class ResolveBroadcastToGroupsAction extends OwnerMessageHandlerAction {
    alias: string | null = null;
    category: string | null = null;
    description: string | null = null;

    hasArgument(): boolean {
        return true;
    }

    patterns(): MessagePatternType {
        return withSign('bcgroup');
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        try {
            const groups = await database.getData('.group');
            const text = `${getTextWithoutCommand(message)}`;

            for (const group in groups) {
                const jid = group + '@g.us'

                await wait(2000)

                queue.add(() => sendWithTyping(
                    socket,
                    {text: `${text}
${Date.now()}`},
                    jid
                ))
            }

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