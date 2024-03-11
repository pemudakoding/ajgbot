import * as baileys from "@whiskeysockets/baileys";
import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageAction from "../../contracts/actions/BaseMessageAction";
import {patternsAndTextIsMatch} from "../../supports/Str";
import queue from "../../services/queue";
import {getGroupId, getJid, isGroup, sendWithTyping} from "../../supports/Message";
import MessageReactHandlerAction from "./MessageReactHandlerAction";
import {isFlagEnabled} from "../../supports/Flag";
import Alias from "../../enums/message/Alias";
import Type from "../../enums/message/Type";


abstract class BaseMessageHandlerAction extends MessageReactHandlerAction implements BaseMessageAction {
  public abstract description: string | null
  public abstract alias: string | null
  public abstract category: string | null

  public showInList: boolean = true

  public abstract patterns(): MessagePatternType

  public abstract process(message: baileys.WAMessage, socket: baileys.WASocket): void

  public abstract hasArgument(): boolean

  public abstract usageExample(): string

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
    if(isGroup(message)) {
      return isFlagEnabled(Type.Group, await getGroupId(message), this.alias as Alias)
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