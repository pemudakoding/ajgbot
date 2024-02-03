import GroupMessageHandlerAction from "../../../foundation/actions/GroupMessageHandlerAction.ts";
import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../../types/MessagePatternType.ts";
import {withSign} from "../../../supports/Str.ts";
import database from "../../../services/database.ts";
import {getGroupId, getJid, isGroup, sendWithTyping} from "../../../supports/Message.ts";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {DataError} from "node-json-db";
import queue from "../../../services/queue.ts";
import Alias from "../../../enums/message/Alias.ts";
import Command from "../../../configs/command.ts";

export default class ResolveGroupRegistrationAction extends GroupMessageHandlerAction {
    alias: string = Alias.GroupRegistration

    hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return withSign('registergroup');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        return isGroup(message) && Boolean(message.key.fromMe)
    }

    public async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        const groupId: string = await getGroupId(message, socket)

        try {
            await database.getData('.group.' + groupId)

            queue.add(() => sendWithTyping(
                socket,
                {text: "Grup telah terdaftar"},
                getJid(message),
                {quoted: message}
            ))

            return
        } catch (Error) {
            if(Error instanceof DataError) {
                const defaultFeature: {[key: string]: boolean} = {};
                const messageHandler = Command.messageHandlers

                messageHandler.map((handler) => {
                    defaultFeature[handler.flag.alias] = handler.flag.isEnabled
                })

                await database.push(
                    '.group.' + groupId,
                    {
                        flags: defaultFeature
                    }
                )

                queue.add(() => sendWithTyping(
                    socket,
                    {text: "Grup berhasil ditambahkan sebagai pemakai fitur grup"},
                    getJid(message),
                    {quoted: message}
                ))

                return
            }

            throw Error
        }
    }
}