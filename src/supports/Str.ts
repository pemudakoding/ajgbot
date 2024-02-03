
import MessagePatternType from "../types/MessagePatternType";
import {getText} from "./Message";
import * as baileys from "@whiskeysockets/baileys";
import 'dotenv/config'

const withSign = (command: string): string => process.env.COMMAND_SIGN + command

const patternsAndTextIsMatch = (patterns: MessagePatternType, message: baileys.WAMessage): boolean => {
    if(Array.isArray(patterns)) {
        for(const pattern of patterns) {
            const regexPattern: RegExp = new RegExp('^\\.' + pattern.replace('.', '') + '\\b')
            console.log(regexPattern)
            if(getText(message)?.toString().toLowerCase().match(regexPattern)) {

                return true
            }
        }
    }

    if(typeof patterns === 'string') {
        const regexPattern: RegExp = new RegExp('^\\.' + patterns.replace('.', '') + '\\b')
        console.log(regexPattern)
        return Boolean(getText(message)?.toString().toLowerCase().match(regexPattern))
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