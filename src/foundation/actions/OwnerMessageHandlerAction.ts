import BaseMessageHandlerAction from "./BaseMessageHandlerAction";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";

export default abstract class OwnerMessageHandlerAction extends BaseMessageHandlerAction {
    public showInList: boolean = false;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        return Boolean(message.key.fromMe);
    }
}