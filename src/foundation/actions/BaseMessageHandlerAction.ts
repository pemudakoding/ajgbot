import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageAction from "../../contracts/actions/BaseMessageAction";
import {patternsAndTextIsMatch} from "../../supports/Str";
import queue from "../../services/queue.ts";
import {getGroupId, getJid, isGroup, sendWithTyping} from "../../supports/Message.ts";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import MessageReactHandlerAction from "./MessageReactHandlerAction.ts";
import {isFlagEnabled} from "../../supports/Flag.ts";
import Alias from "../../enums/message/Alias.ts";


abstract class BaseMessageHandlerAction extends MessageReactHandlerAction implements BaseMessageAction {
  public abstract description: string
  public abstract alias: string;
  public abstract category: string

  public abstract patterns(): MessagePatternType

  public abstract process(message: baileys.WAMessage, socket: baileys.WASocket): void

  public abstract hasArgument(): boolean

  public abstract usageExample(): string

  public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
    if(isGroup(message)) {
      return isFlagEnabled('group', await getGroupId(message, socket), this.alias as Alias)
    }

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

      await this.process(message, socket)
    } catch (Error) {
      this.reactToFailed(message,socket)

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