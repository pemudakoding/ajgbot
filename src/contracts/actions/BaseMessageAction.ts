import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";

interface BaseMessageAction {
    execute: (message: baileys.WAMessage, socket: baileys.WASocket) => void
    patterns: () => MessagePatternType,
    hasArgument: () => boolean,
}

export default BaseMessageAction