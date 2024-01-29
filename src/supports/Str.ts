
import MessagePatternType from "../types/MessagePatternType";
import {getText} from "./Message";
import {WAMessage} from "@whiskeysockets/baileys";

const withSign = (command: string): string => process.env.COMMAND_SIGN + command

const patternsAndTextIsMatch = (patterns: MessagePatternType, message: WAMessage): boolean => {
    if(Array.isArray(patterns)) {
        for(const pattern of patterns) {
            if(pattern === getText(message)) {
                return true
            }
        }
    }

    if(typeof patterns === 'string') {
        return patterns === getText(message)
    }

    return false
}

export {
    withSign,
    patternsAndTextIsMatch,
}