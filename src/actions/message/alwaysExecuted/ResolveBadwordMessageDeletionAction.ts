import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {jidDecode, jidNormalizedUser, WAMessage, WASocket} from "@whiskeysockets/baileys";
import Alias from "../../../enums/message/Alias";
import Type from "../../../enums/message/Type";
import {getGroupId, getJid, getText, isGroup, sendWithTyping} from "../../../supports/Message";
import {isFlagEnabled} from "../../../supports/Flag";
import CheckIsTextContainBadwordsAction from "../../database/CheckIsTextContainBadwordsAction";
import queue from "../../../services/queue";
import {withSign} from "../../../supports/Str";

export default class ResolveBadwordMessageDeletionAction extends BaseMessageHandlerAction {
    alias: string | null = Alias.AntiBadword;
    category: string | null;
    description: string | null;

    hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return null;
    }

    async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        const type: Type = isGroup(message) ? Type.Group : Type.Individual
        const botNumber: string = jidDecode(socket.user!.id)!.user;
        const identifier: string = isGroup(message) ? await getGroupId(message) : botNumber

        return isFlagEnabled(type, identifier, this.alias as Alias);
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        if((new RegExp(`^${withSign('addbadword')}`)).test(getText(message))) {
            return
        }

        if(await CheckIsTextContainBadwordsAction.execute(getText(message))) {
            if(isGroup(message)) {
                queue.add(() => {
                    socket.sendMessage(message.key.remoteJid!,{delete: message.key})
                })
            }

            queue.add(() => {
                sendWithTyping(
                    socket,
                    {
                        text: message.verifiedBizName || message.pushName + ' Jangan badword, itu kata sederhana tapi tuhan marah',
                        mentions: [jidNormalizedUser(message.key.remoteJid!)]
                    },
                    getJid(message)
                )
            })
        }
    }

    usageExample(): string {
        return "";
    }

}