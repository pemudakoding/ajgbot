import BaseMessageHandlerAction from "../../foundation/actions/BaseMessageHandlerAction.ts";
import MessagePatternType from "../../types/MessagePatternType.ts";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {withSign} from "../../supports/Str.ts";
import Alias from "../../enums/message/Alias.ts";
import Category from "../../enums/message/Category.ts";
import CommandDescription from "../../enums/message/CommandDescription.ts";
import command from "../../configs/command.ts";
import MessageHandler from "../../types/MessageHandler.ts";
import queue from "../../services/queue.ts";
import {getJid, sendWithTyping} from "../../supports/Message.ts";

export default class ResolveListOfCommandsAction extends BaseMessageHandlerAction {
    alias: string = Alias.ListOfCommands;
    category: string = Category.Random;
    description: string = CommandDescription.ListOfCommands;

    hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return [withSign('list'), withSign('help')];
    }

    process(message: WAMessage, socket: WASocket): void {
        const groupedhandlers: {[key: string]: MessageHandler[]} = this.resolveForCommandGroup()

        let text = 'Hi this is MAA BOT  \n\n' +
            '======= Daftar Fitur Bot ======= \n'

        let iteration: number = 1;
        for (const group in groupedhandlers) {
            text += '\n=== _' + iteration + '. ' + group + '_\n'

            text += this.resolveGroupFeaturesText(groupedhandlers[group]!)

            iteration++
        }

        text += '\n\nSankyuuu!!!'

        queue.add(() => sendWithTyping(socket,{text}, getJid(message)))
    }

    usageExample(): string {
        return ".help";
    }

    protected resolveForCommandGroup(): {[key: string]: MessageHandler[]} {
        const group: {[key: string]: MessageHandler[]} = {}

        command.messageHandlers.map((handler: MessageHandler): void  => {
            if(! group[handler.details.category]) {
                group[handler.details.category] = []
            }

            group[handler.details.category]!.push(handler)
        })

        return group
    }

    protected resolveGroupFeaturesText(handlers: MessageHandler[]) {
        let handlerIteration = 1;

        let text: string = '';

        for (const handler of handlers) {
            const patterns: MessagePatternType = handler.concrete.patterns();
            let showedPatterns = '';

            if(Array.isArray(patterns)) {
                showedPatterns = patterns.join(', ')
            } else {
                showedPatterns = patterns
            }

            text += handlerIteration + ". " + handler
                .concrete
                .alias
                .toLowerCase()
                .replace('-', ' ')
                .replace(/\b\w/g, text => text.toUpperCase()) + ": *" + showedPatterns + '*\n'

            handlerIteration++
        }

        return text
    }
}