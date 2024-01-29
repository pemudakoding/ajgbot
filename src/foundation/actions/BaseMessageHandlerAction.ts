import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import BaseMessageAction from "../../contracts/actions/BaseMessageAction";
import {patternsAndTextIsMatch} from "../../supports/Str";

abstract class BaseMessageHandlerAction implements BaseMessageAction{
  public abstract patterns(): MessagePatternType

  public abstract sendMessage(message: baileys.WAMessage, socket: baileys.WASocket): void

  public async execute(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
    if(! patternsAndTextIsMatch(this.patterns(), message)) {
      return;
    }

    this.sendMessage(message, socket)
  }

}

export default BaseMessageHandlerAction