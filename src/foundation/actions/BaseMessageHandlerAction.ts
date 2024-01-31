import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageAction from "../../contracts/actions/BaseMessageAction";
import {patternsAndTextIsMatch} from "../../supports/Str";
import queue from "../../services/queue.ts";
import {getJid, react, sendWithTyping} from "../../supports/Message.ts";

abstract class BaseMessageHandlerAction implements BaseMessageAction{
  public abstract patterns(): MessagePatternType

  public abstract sendMessage(message: baileys.WAMessage, socket: baileys.WASocket): void

  public abstract hasArgument(): boolean

  public async execute(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
    try {
      if(! patternsAndTextIsMatch(this.patterns(), message)) {
        return;
      }

      await this.sendMessage(message, socket)
    } catch (Error) {
      queue.add(() => react(socket, '❌', message))

      queue.add(() => sendWithTyping(
          socket,
          { text: Error.message },
          getJid(message),
          {
            quoted: message
          }
      ))
    }
  }

}

export default BaseMessageHandlerAction