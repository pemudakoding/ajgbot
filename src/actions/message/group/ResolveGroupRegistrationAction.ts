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
import CommandDescription from "../../../enums/message/CommandDescription.ts";
import Path from "../../../enums/services/Database/Path.ts";
import Category from "../../../enums/message/Category.ts";

export default class ResolveGroupRegistrationAction extends GroupMessageHandlerAction {
    description: string = CommandDescription.GroupRegistration
    alias: string = Alias.GroupRegistration
    category: string = Category.Group

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
        const path = Path.GroupWithIdentifier.replace(':identifier', groupId);
        try {
            await database.getData(path)

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
                    path,
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

    usageExample(): string {
        return "~";
    }
}