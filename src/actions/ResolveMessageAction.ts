import { WASocket } from '@whiskeysockets/baileys';
import { BaileysEventMap } from '@whiskeysockets/baileys/lib/Types';
import { WAMessage} from '@whiskeysockets/baileys/lib/Types/Message';
import command from "../configs/command";
import {patternsAndTextIsMatch} from "../supports/Str";

class ResolveMessageAction {
  public static async execute(socket: WASocket,messages: BaileysEventMap['messages.upsert']): Promise<void> {
    const messageInformations: WAMessage[] = messages.messages

    for(const message of messageInformations) {
      for(const handler of command.messageHandlers) {
        if(patternsAndTextIsMatch(handler.patterns, message)) {
          await handler.concrete.execute(message, socket)

          return;
        }
      }
    }
  }
}

export default ResolveMessageAction