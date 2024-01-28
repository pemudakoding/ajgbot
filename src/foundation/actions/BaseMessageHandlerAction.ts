import {WAMessage, WASocket} from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageAction from "../../contracts/actions/BaseMessageAction";
import {getText} from "../../supports/Message";

abstract class BaseMessageHandlerAction implements BaseMessageAction{
  public abstract patterns(): MessagePatternType

  public abstract sendMessage(message: WAMessage, socket: WASocket): void

  public async execute(message: WAMessage, socket: WASocket): Promise<void> {
    if(! this.ensureCommandIsValid(message)) {
      return;
    }

    this.sendMessage(message, socket)
  }

  protected ensureCommandIsValid(message: WAMessage): boolean {
    if(Array.isArray(this.patterns())) {
      for(const pattern of this.patterns()) {
        if(pattern === getText(message)) {
          return true
        }
      }
    }

    if(typeof this.patterns() === 'string') {
      return this.patterns() === getText(message)
    }

    throw Error('the patterns only valid for string and array type')
  }
}

export default BaseMessageHandlerAction