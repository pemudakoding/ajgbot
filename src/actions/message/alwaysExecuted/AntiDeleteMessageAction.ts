import {
    AnyMessageContent,
    isJidGroup,
    isJidStatusBroadcast,
    jidDecode, jidNormalizedUser,
    WAMessage,
    WASocket
} from "@whiskeysockets/baileys";
import queue from "../../../services/queue";
import {
    downloadContentBufferFromMessage,
    getJid,
    getJidNumber,
    isGroup,
    sendWithTyping
} from "../../../supports/Message";
import {DataError} from "node-json-db";
import database from "../../../services/database";

export default class AntiDeleteMessageAction {
    async execute(message: WAMessage, socket: WASocket): Promise<void> {
        const protocol = JSON.parse(JSON.stringify(message.message)) as {
            protocolMessage: {
                key: {
                    remoteJid: string;
                    fromMe: boolean;
                    id: string;
                };
                type: "REVOKE";
            };
        };

        if (protocol?.protocolMessage?.type !== "REVOKE") {
            return;
        }

        try {
            const jid = getJid(message);
            const path = `data.messages.${getJidNumber(jid)}.${protocol.protocolMessage.key.id}`;
            const data = await database.getData(path)
            const sendJid = isGroup(message) ? getJid(message) : jidNormalizedUser(socket.user?.id);
            const text: string = await this.resolveMessageMetaData(message, socket, jid, data);
            const media = data.type == 'text'
                ? null
                : (await downloadContentBufferFromMessage(
                    data.media,
                    data.type
                )) as Buffer;

            const messageText = [text, data.type == 'text' ? data.text : data.caption].join("\n\n").trim()

            let messageToSend: AnyMessageContent | null = null;

            switch (data.type) {
                case 'text':
                    messageToSend = { text: messageText };
                break
                case 'image':
                    messageToSend =  {
                        image: media!,
                        caption: messageText,
                    };
                    break
                case 'video':
                    messageToSend =  {
                        video: media!,
                        caption: messageText,
                    };
                    break
                case 'document':
                    messageToSend = {
                        document: media!,
                        mimetype: data.mimetype || "application/octet-stream",
                        fileName: data.fileName,
                        caption: messageText,
                    };
                    break
                case 'audio':
                    messageToSend =  {
                        audio: media!,
                        caption: messageText,
                    };
                    break
            }

            if(! messageToSend) {
                return;
            }

            const sendMessage = await queue.add(() =>
                sendWithTyping(
                    socket,
                    messageToSend!,
                    sendJid
                )
            );

            if (["audio"].includes(data.type)) {
                await queue.add(() =>
                    sendWithTyping(
                        socket,
                        { text: text },
                        sendJid,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        { quoted: sendMessage }
                    )
                );
            }

            database.delete(path)
        } catch (Error) {
            if(Error instanceof DataError) {
                return;
            }

            throw Error;
        }
    }

    protected async resolveMessageMetaData(
        message: WAMessage,
        socket: WASocket,
        jid: string,
        data: { timestamp: string },
    ): Promise<string>
    {
        const formatterDate = new Intl.DateTimeFormat("id", {
            dateStyle: "full",
            timeStyle: "long",
        });

        let text = "*Pesan Dihapus Terdeteksi 📣📣📣*\n\n";

        if (isJidGroup(jid)) {
            const metadata = await socket.groupMetadata(jid);
            text += "Grup: *" + metadata.subject + "\n";
        }  else if (isJidStatusBroadcast(jid)) {
            text += "Story Whatsapp\n";
        }

        text += `
User: *${message.verifiedBizName || message?.pushName}*
NoHP: ${jidDecode(message.key.participant || message.key.remoteJid!)?.user}

Waktu Dibuat: 
${formatterDate.format(new Date(data.timestamp))}

Waktu Dihapus: 
${formatterDate.format(new Date())}

Pesan yang Dihapus:\n`
            .trim();

        return text
    }
}