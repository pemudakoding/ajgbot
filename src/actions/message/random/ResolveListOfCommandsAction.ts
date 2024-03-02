import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import {withSign} from "../../../supports/Str";
import Alias from "../../../enums/message/Alias";
import Category from "../../../enums/message/Category";
import CommandDescription from "../../../enums/message/CommandDescription";
import command from "../../../configs/command";
import MessageHandler from "../../../types/MessageHandler";
import queue from "../../../services/queue";
import {getJid, sendWithTyping} from "../../../supports/Message";

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

        text += '\n' +
            '======================\n' +
            '======= Donasi ======= \n' +
            '======================\n' +
            'Dengan Berdonasi bisa membuat bot ini tetap hidup. ' +
            'Jadi kalau dirasa berguna, silahkan dukung bot ini dengan cara berdonasi. \n\n' +
            'Trakteer: https://trakteer.id/anakanjing_20/tip'

        text += '\n\nSankyuuu!!!'

        queue.add(() => sendWithTyping(socket,{text}, getJid(message)))
    }

    usageExample(): string {
        return ".help";
    }

    protected resolveForCommandGroup(): {[key: string]: MessageHandler[]} {
        const group: {[key: string]: MessageHandler[]} = {}

        command
            .messageHandlers
            .filter((handler: MessageHandler) => handler.details.showInList)
            .map((handler: MessageHandler): void  => {
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

            if(patterns === null) {
                continue;
            }

            if(Array.isArray(patterns)) {
                showedPatterns = patterns.join(', ')
            } else {
                showedPatterns = patterns
            }

            if(handler.concrete.alias === null) {
                continue;
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