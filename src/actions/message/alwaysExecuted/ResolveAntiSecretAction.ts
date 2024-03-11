import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import Alias from "../../../enums/message/Alias";
import MessagePatternType from "../../../types/MessagePatternType";
import {jidDecode, WAMessage, WASocket} from "@whiskeysockets/baileys";
import Type from "../../../enums/message/Type";
import {getGroupId, isGroup } from "../../../supports/Message";
import {isFlagEnabled} from "../../../supports/Flag";
import AntiViewOnceMessageAction from "./AntiViewOnceMessageAction";
import AntiDeleteMessageAction from "./AntiDeleteMessageAction";

export default class ResolveAntiSecretAction extends BaseMessageHandlerAction {
    alias: string | null = Alias.AntiSecret;
    category: string | null = null;
    description: string | null = null;
    showInList: boolean = false;

    hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return null;
    }

    async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        const type: Type = isGroup(message) ? Type.Group : Type.Individual
        const botNumber: string = jidDecode(socket.user!.id)!.user;
        const identifier: string = isGroup(message) ? await getGroupId(message, socket) : botNumber

        return isFlagEnabled(type, identifier, this.alias as Alias);
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        (new AntiViewOnceMessageAction()).execute(message, socket);
        (new AntiDeleteMessageAction()).execute(message, socket);
    }

    usageExample(): string {
        return "";
    }
}