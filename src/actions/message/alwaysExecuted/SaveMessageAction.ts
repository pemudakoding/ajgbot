import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import MessagePatternType from "../../../types/MessagePatternType";
import {DownloadableMessage, getContentType, proto, WAMessage, WASocket} from "@whiskeysockets/baileys";
import {getGroupId, getJid, getJidNumber, getText, isGroup} from "../../../supports/Message";
import Alias from "../../../enums/message/Alias";
import database from "../../../services/database";
import {isFlagEnabled} from "../../../supports/Flag";
import Type from "../../../enums/message/Type";
import CheckIsTextContainBadwordsAction from "../../database/CheckIsTextContainBadwordsAction";
import IWebMessageInfo = proto.IWebMessageInfo;

export default class SaveMessageAction extends BaseMessageHandlerAction {
    alias: string | null = Alias.AntiSecret;
    category: string | null = null;
    description: string | null = null;
    showInList: boolean = false;

    hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return null
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        if(isGroup(message)) {
            return isFlagEnabled(Type.Group, await getGroupId(message), this.alias as Alias)
        }

        return ! message.key.fromMe
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async process(message: WAMessage, socket: WASocket): Promise<void> {
        const messageTypes = [
            "imageMessage",
            "videoMessage",
            "audioMessage",
            "documentMessage",
            "documentWithCaptionMessage",
        ] as (keyof proto.IMessage)[];

        let resolvedMessage = message;
        let text = getText(message);
        let type = getContentType(message.message!);

        if(type === "viewOnceMessage" || type === 'viewOnceMessageV2' || type === 'viewOnceMessageV2Extension') {
            return;
        }

        if(! messageTypes.includes(type!)) {
            this.saveTextOnlyMessage(message);

            return;
        }

        if (type === "documentWithCaptionMessage") {
            resolvedMessage = resolvedMessage.message?.documentWithCaptionMessage as IWebMessageInfo;
            type = "documentMessage";
            text = resolvedMessage?.message?.documentMessage?.caption || "";
        }

        if(isGroup(message)
            && await CheckIsTextContainBadwordsAction.execute(text)
            && await isFlagEnabled(Type.Group, await getGroupId(message), Alias.AntiBadword)
        ) {
            return;
        }

        const downloadableMedia: DownloadableMessage = {
            directPath:
            resolvedMessage.message![type as "imageMessage"]?.directPath,
            mediaKey: resolvedMessage.message![type as "imageMessage"]?.mediaKey,
            url: resolvedMessage.message![type as "imageMessage"]?.url,
        };

        const types: { [key in keyof proto.IMessage]: string } = {
            imageMessage: "image",
            videoMessage: "video",
            documentMessage: "document",
            documentWithCaptionMessage: "document",
            audioMessage: "audio",
        };

        this.saveDownloadableMedia(
            types[type as never],
            message,
            downloadableMedia,
            text,
            resolvedMessage.message![type as "documentMessage"]?.mimetype,
            resolvedMessage.message![type as "documentMessage"]?.fileName
        );
    }

    usageExample(): string {
        return "";
    }

    protected saveDownloadableMedia(
        type: string,
        message: WAMessage,
        media: DownloadableMessage,
        caption?: string,
        mimetype?: string | undefined | null,
        fileName?: string | undefined | null
    ): void {
        const jid = getJid(message);
        const messageId = message.key.id;

        const mediaHasCaption = ["image", "video", "document", "audio"];
        if (mediaHasCaption.includes(type)) {
            database.push(`.messages.${getJidNumber(jid)}.${messageId!}`, {
                type: type as string,
                media,
                timestamp: Date.now(),
                caption,
                mimetype: mimetype || undefined,
                fileName: fileName || undefined,
            });
        }
    }

    saveTextOnlyMessage(message: WAMessage): void {
        const jid = getJid(message);
        const messageId = message.key.id;

        database.push(`.messages.${getJidNumber(jid)}.${messageId!}`, {
            type: "text",
            text: getText(message),
            timestamp: Date.now(),
        });
    }
}