import {WASocket} from "@whiskeysockets/baileys";
import MessagePatternType from "../../types/MessagePatternType";
import {WAMessage} from "@whiskeysockets/baileys/lib/Types/Message";

interface BaseMessageAction {
    execute: (message: WAMessage, socket: WASocket) => void
    patterns: () => MessagePatternType,
}

export default BaseMessageAction