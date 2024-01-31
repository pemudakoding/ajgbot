import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageAction from "../../contracts/actions/BaseMessageAction";
import {patternsAndTextIsMatch} from "../../supports/Str";
import queue from "../../services/queue.ts";
import {getJid, react, sendWithTyping} from "../../supports/Message.ts";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";

abstract class BaseMessageHandlerAction implements BaseMessageAction{
  public abstract patterns(): MessagePatternType

  public abstract processAction(message: baileys.WAMessage, socket: baileys.WASocket): void

  public abstract hasArgument(): boolean

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
    return true
  }

  public async execute(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
    try {
      if(! patternsAndTextIsMatch(this.patterns(), message)) {
        return;
      }

      if(! await this.isEligibleToProcess(message, socket)) {
        return;
      }

      await this.processAction(message, socket)
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