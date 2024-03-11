import {DataError} from "node-json-db";
import database from "../../services/database";

export default class DeleteSavedMessagesAction {
    public static async execute(): Promise<void> {
        try {
            const messages = await database.getData('.messages');
            const now = Date.now();

            for (const jid in messages) {
                for (const messageId in messages[jid]) {
                    if (
                        now - messages[jid][messageId].timestamp >
                        24 * 60 * 60 * 1000
                    ) {
                        database.delete(`.messages.${jid}.${messageId}`);
                    }
                }
            }
        } catch (Error) {
            if(Error instanceof DataError) {
                console.log('Does not have any message saved yet');
            }

            throw Error
        }
    }
}