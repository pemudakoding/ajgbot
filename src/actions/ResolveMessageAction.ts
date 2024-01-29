import * as baileys from '@whiskeysockets/baileys';
import command from "../configs/command";
import {patternsAndTextIsMatch} from "../supports/Str";

class ResolveMessageAction {
  public static async execute(socket: baileys.WASocket,messages: baileys.BaileysEventMap['messages.upsert']): Promise<void> {
    const messageInformations: baileys.WAMessage[] = messages.messages

    for(const message of messageInformations) {
      for(const handler of command.messageHandlers) {
        if(patternsAndTextIsMatch(handler.patterns, message)) {
          message;
          socket;

          return;
        }
      }
    }
  }
}

export default ResolveMessageAction