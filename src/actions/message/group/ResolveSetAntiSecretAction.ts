import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {jidDecode, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getArguments, withSign} from "../../../supports/Str";
import {getGroupId, getJid, getText, isGroup, isParticipantAdmin, sendWithTyping} from "../../../supports/Message";
import Path from "../../../enums/services/Database/Path";
import database from "../../../services/database";
import queue from "../../../services/queue";
import Alias from "../../../enums/message/Alias";
import Category from "../../../enums/message/Category";
import CommandDescription from "../../../enums/message/CommandDescription";

export default class ResolveSetAntiSecretAction extends BaseMessageHandlerAction{
    alias: string =  Alias.AntiSecret;
    category: string =  Category.Group;
    description: string = CommandDescription.AntiSecret;

    hasArgument(): boolean {
        return true;
    }

    patterns(): MessagePatternType {
        return withSign('setantisecret');
    }

    async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        if(isGroup(message)) {
            return isParticipantAdmin(message, socket)
        }

        return true;
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        this.reactToProcessing(message, socket)

        const argument: string[] = getArguments(getText(message))
        const type: string = isGroup(message) ? 'group' : 'individual'
        const botNumber: string = jidDecode(socket.user!.id)!.user;
        const identifier: string = isGroup(message) ? await getGroupId(message) : botNumber
        const path: string = Path
            .Flags
            .replace(':type', type)
            .replace(':id', identifier)

        if(argument[0] != 'on' && argument[0] != 'off') {
            queue.add(() => {
               sendWithTyping(socket, {text: "hanya menerima on/off"}, getJid(message), {quoted: message})
            });
            
            this.reactToInvalid(message, socket)

            return;
        }
        const data: {[key: string]: boolean} = {}
        
        data[this.alias] = argument[0] === 'on';
        
        await database.push(
            path,
            data,
            false
        )
        
        queue.add(() => {
            sendWithTyping(socket, {text: "anti rahasia berhasil di-" + argument[0] + ' kan'}, getJid(message), {quoted: message})

            this.reactToDone(message, socket)
        });
    }

    usageExample(): string {
        return ".setantisecret on/off";
    }
    
}