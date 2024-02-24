import * as baileys from '@whiskeysockets/baileys';
import command from "../../configs/command";
import {patternsAndTextIsMatch} from "../../supports/Str";

class ResolveMessageAction {
  public static async execute(socket: baileys.WASocket,messages: baileys.BaileysEventMap['messages.upsert']): Promise<void> {
    const messageInformations: baileys.WAMessage[] = messages.messages

    for(const message of messageInformations) {
      for(const handler of command.messageHandlers) {
        if(handler.patterns === null) {
          handler.concrete.execute(message, socket)

          continue;
        }

        if(patternsAndTextIsMatch(handler.patterns, message)) {
          handler.concrete.execute(message, socket)

          return;
        }
      }
    }
  }
}

export default ResolveMessageAction