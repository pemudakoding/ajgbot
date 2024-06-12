import MessagePatternType from "src/types/MessagePatternType";
import BaseMessageHandlerAction from "../../../foundation/actions/BaseMessageHandlerAction";
import {
    WAMessage,
    WASocket,
    WAMessageStubType,
} from "@whiskeysockets/baileys";
import {getGroupId, getJid, isGroup} from "../../../supports/Message";
import queue from "../../../services/queue";
import axios from "axios";
import telegraph from "../../../services/telegraph";
import {isFlagEnabled} from "../../../supports/Flag";
import Type from "../../../enums/message/Type";
import Alias from "../../../enums/message/Alias";


export default class ResolveWelcomeCardAction extends BaseMessageHandlerAction {
    public alias: string | null = null;
    public category: string | null = null;
    public description: string | null = null;
    public showInList = false

    public hasArgument(): boolean {
        return false;
    }

    patterns(): MessagePatternType {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async isEligibleToProcess(message: WAMessage, socket: WASocket): Promise<boolean> {
        if(false === isGroup(message)) {
            return false
        }

        if(false === Object.hasOwn(message, 'messageStubParameters')){
            return false
        }

        if(false === await isFlagEnabled(Type.Group, await getGroupId(message), this.alias as Alias)) {
            return false
        }

        return message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD
    }

    async process(message: WAMessage, socket: WASocket): Promise<void> {
        const participantJids: string[] | null | undefined = message.messageStubParameters;

        participantJids?.map(async (participantJid: string) => {
            let profileUrl : string | undefined;

            try {
                profileUrl = (await socket.profilePictureUrl(participantJid, 'image'))
            } catch (Error) {
                profileUrl = 'https://i.ibb.co/vXzDh4y/gradient-lo-fi-illustrations-52683-84144.jpg';
            }

            const groupName = (await socket.groupMetadata(message.key.remoteJid!)).subject;
            const welcomeMessage = "@" + participantJid.split('@')[0] + " Silahkan intro terdahulu! 🤨"
            const greetingTitle = 'Welcome To'
            const photo = await axios.get(profileUrl!, {responseType: "arraybuffer"});
            const uploadedProfileLink: string = await telegraph(photo.data)

            const response = await axios.get(
                'https://api.popcat.xyz/welcomecard?background=https://i.ibb.co/dkXJ7rw/1349198-1.jpg' +
                "&text1=" + encodeURI(greetingTitle) +
                "&text2=" + encodeURI(groupName) +
                "&text3=" + encodeURI("Member " + (await socket.groupMetadata(message.key.remoteJid!)).participants.length)+
                "&avatar=" + uploadedProfileLink,
                {
                    responseType: 'arraybuffer'
                }
            )

            queue.add(() => socket.sendMessage(
                getJid(message),
                {
                    image: response.data,
                    caption: welcomeMessage,
                    mentions: [participantJid]
                }
            ))
        })

    }

    usageExample(): string {
        return "";
    }
}