import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import BaseMessageHandlerAction from "./BaseMessageHandlerAction.ts";

export default abstract class GroupMessageHandlerAction extends BaseMessageHandlerAction {
    public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        return super.isEligibleToProcess(message, socket)
    }
}