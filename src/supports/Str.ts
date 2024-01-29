
import MessagePatternType from "../types/MessagePatternType";
import {getText} from "./Message";
import * as baileys from "@whiskeysockets/baileys";
import 'dotenv/config'

const withSign = (command: string): string => process.env.COMMAND_SIGN + command

const patternsAndTextIsMatch = (patterns: MessagePatternType, message: baileys.WAMessage, containArguments: boolean = false): boolean => {
    const endOfPattern: string = containArguments ? '$' : '';

    if(Array.isArray(patterns)) {
        for(const pattern of patterns) {
            const regexPattern: RegExp = new RegExp('^' + pattern + endOfPattern)

            if(getText(message)?.toString().match(regexPattern)) {
                return true
            }
        }
    }

    if(typeof patterns === 'string') {
        const regexPattern: RegExp = new RegExp('^' + patterns + endOfPattern)

        return Boolean(getText(message)?.toString().match(regexPattern))
    }

    return false
}

const getArguments = (text: string): string[] => {
    const splittedText: string[] = text.split(' ');

    splittedText.shift();

    return splittedText
}

export {
    withSign,
    patternsAndTextIsMatch,
    getArguments
}