import * as baileys from "@whiskeysockets/baileys";
import queue from "../../services/queue.ts";
import {react} from "../../supports/Message.ts";
import {WASocket} from "@whiskeysockets/baileys";
import Emoji from "../../enums/foundation/Emoji.ts";

export default abstract class MessageReactHandlerAction {
    protected async reactToProcessing(message: baileys.WAMessage, socket: WASocket): Promise<void> {
        await queue.add(() => react(socket, Emoji.Processing, message))
    }

    protected resetReact(message: baileys.WAMessage, socket: WASocket): void {
        queue.add(() => react(socket, '', message))
    }

    protected reactToDone(message: baileys.WAMessage, socket: WASocket): void {
        queue.add(() => react(socket, Emoji.Done, message))
    }

    protected reactToFailed(message: baileys.WAMessage, socket: WASocket): void {
        queue.add(() => react(socket, Emoji.Failed, message))
    }

    protected reactToInvalid(message: baileys.WAMessage, socket: WASocket): void {
        queue.add(() => react(socket, Emoji.Invalid, message))
    }
}