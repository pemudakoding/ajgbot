import GroupMessageHandlerAction from "../../foundation/actions/GroupMessageHandlerAction.ts";
import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType.ts";
import {withSign} from "../../supports/Str.ts";
import database from "../../services/database.ts";
import {getGroupId, getJid, isGroup, sendWithTyping} from "../../supports/Message.ts";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {DataError} from "node-json-db";
import queue from "../../services/queue.ts";
import Alias from "../../enums/message/Alias.ts";
import Command from "../../configs/command.ts";
import CommandDescription from "../../enums/message/CommandDescription.ts";
import Path from "../../enums/services/Database/Path.ts";
import Category from "../../enums/message/Category.ts";
import MessageHandler from "../../types/MessageHandler.ts";

export default class ResolveFeatureSynchronizeAction extends GroupMessageHandlerAction {
    description: string = CommandDescription.SyncFeature
    alias: string = Alias.SyncFeature
    category: string = Category.Random

    hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return withSign('syncfeature');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        return Boolean(message.key.fromMe)
    }

    public async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        const groupId: string = await getGroupId(message, socket)
        const path = Path.TypeWithIdentifier
            .replace(':type', isGroup(message) ? 'group' : 'personal')
            .replace(':identifier', groupId);

        try {
            const existingFlags = await database.getData(path)

            const messageHandler = Command.messageHandlers

            messageHandler.map((handler: MessageHandler) => {
                if(Object.prototype.hasOwnProperty.call(existingFlags, handler.flag.alias)) {
                    return
                }

                if(typeof existingFlags == 'object') {
                    existingFlags[handler.flag.alias] = handler.flag.isEnabled
                }
            })

            await database.delete(path)
            await database.push(path, existingFlags)

            queue.add(() => sendWithTyping(
                socket,
                {text: "Feature berhasil disinkronisasi"},
                getJid(message),
                {quoted: message}
            ))
            return
        } catch (Error) {
            console.log(Error)
            if(Error instanceof DataError) {
                queue.add(() => sendWithTyping(
                    socket,
                    {text: "Silahkan register group terdahulu dude!!!"},
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