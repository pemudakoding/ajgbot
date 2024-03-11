
import MessagePatternType from "../types/MessagePatternType";
import {getText} from "./Message";
import * as baileys from "@whiskeysockets/baileys";
import 'dotenv/config'

const withSign = (command: string): string => process.env.COMMAND_SIGN + command

const patternsAndTextIsMatch = (patterns: MessagePatternType, message: baileys.WAMessage): boolean => {
    if(patterns === null) {
        return true;
    }

    if(Array.isArray(patterns)) {
        for(const pattern of patterns) {
            const regexPattern: RegExp = new RegExp('^\\.' + pattern.replace('.', '') + '\\b')

            if(getText(message)?.toString().toLowerCase().match(regexPattern)) {

                return true
            }
        }
    }

    if(typeof patterns === 'string') {
        const regexPattern: RegExp = new RegExp('^\\.' + patterns.replace('.', '') + '\\b')

        return Boolean(getText(message)?.toString().toLowerCase().match(regexPattern))
    }

    return false
}

const getArguments = (text: string): string[] => {
    const splittedText: string[] = text.split(/\s/);

    splittedText.shift();

    return splittedText
        .filter((argument: string) => argument.trim() !== '')
        .map((argument: string) => argument.trim())
}

const getTextAfterSign = (text: string, signs: string | string[]) => {
    let resolvedText= text;

    if(Array.isArray(signs)) {
        for (const sign in signs) {
            resolvedText = resolvedText.replace(new RegExp(`^${signs[sign]}`), '').trim()
        }

    } else {
        resolvedText = resolvedText.replace(`^${signs}`, '').trim()
    }

    return resolvedText.toString()
}

export {
    withSign,
    patternsAndTextIsMatch,
    getArguments,
    getTextAfterSign
}