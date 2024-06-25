import * as baileys from "@whiskeysockets/baileys";
import MessagePatternType from "../../../types/MessagePatternType";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import {withSign} from "../../../supports/Str";
import {getJid, getText} from "../../../supports/Message";
import Alias from "../../../enums/message/Alias";
import CommandDescription from "../../../enums/message/CommandDescription";
import Category from "../../../enums/message/Category";
import * as cheerio from "cheerio";
import axios from "axios";
import queue from "../../../services/queue";

class ResolveCheckKhodamAction extends BaseMessageHandlerAction{
    description: string = CommandDescription.CheckKhodam
    alias: string = Alias.CheckKhodam
    category: string = Category.Random

    patterns(): MessagePatternType {
        return withSign('khodam')
    }

    async process(message: baileys.WAMessage, socket: baileys.WASocket): Promise<void> {
        this.reactToProcessing(message, socket);

        const text: string = getText(message)
        const splittedText = text.match(/\.(.*?) ((.*?)$)/)

        const name = splittedText![splittedText!.length - 1]!

        if(name.length == 0) {
            throw new Error('Minimal input nama buat cek khodam bosssss!')
        }

        const response = await axios.get('https://khodam.vercel.app/v2?nama='+ encodeURI(name));
        const body = response.data;

        const $ = cheerio.load(body);
        const khodam = $('.__className_cad559.text-3xl.font-bold.text-rose-600').text();

        queue.add(async () => {
            await socket.sendMessage(
                getJid(message),
                {
                    text: "Khodam " + "`" + name +"`" + " hari ini adalah... \n" + `*${khodam}*`
                }
            )

            this.reactToDone(message, socket)
        })
    }

    hasArgument(): boolean {
        return false
    }

    usageExample(): string {
        return ".khodam";
    }
}

export default ResolveCheckKhodamAction