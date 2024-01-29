
import MessagePatternType from "../types/MessagePatternType";
import {getText} from "./Message";
import * as baileys from "@whiskeysockets/baileys";
import 'dotenv/config'

const withSign = (command: string): string => process.env.COMMAND_SIGN + command

const patternsAndTextIsMatch = (patterns: MessagePatternType, message: baileys.WAMessage): boolean => {
    if(Array.isArray(patterns)) {
        for(const pattern of patterns) {
            const regexPattern: RegExp = new RegExp('^' + pattern + '$')

            if(getText(message)?.toString().match(regexPattern)) {
                return true
            }
        }
    }

    if(typeof patterns === 'string') {
        const regexPattern: RegExp = new RegExp('^' + patterns + '$')

        return Boolean(getText(message)?.toString().match(regexPattern))
    }

    return false
}

export {
    withSign,
    patternsAndTextIsMatch,
}