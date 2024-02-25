import * as baileys from '@whiskeysockets/baileys';
import command from "../../configs/command";
import {patternsAndTextIsMatch} from "../../supports/Str";
import {handlerQueue} from "../../services/queue";

class ResolveMessageAction {
  public static async execute(socket: baileys.WASocket,messages: baileys.BaileysEventMap['messages.upsert']): Promise<void> {
    const messageInformations: baileys.WAMessage[] = messages.messages

    for(const message of messageInformations) {
      for(const handler of command.messageHandlers) {
        if(handler.patterns === null) {
          handlerQueue.add(() => handler.concrete.execute(message, socket))

          continue;
        }

        if(patternsAndTextIsMatch(handler.patterns, message)) {
          handlerQueue.add(() => handler.concrete.execute(message, socket))

          return;
        }
      }
    }
  }
}

export default ResolveMessageAction