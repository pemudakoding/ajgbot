import {WASocket, delay, GroupMetadata, GroupParticipant} from '@whiskeysockets/baileys';
import { AnyMessageContent, WAMessage, WATextMessage } from '@whiskeysockets/baileys/lib/Types/Message';

const getJid = (message: WAMessage): string => {
  return message.key.remoteJid ?? ''
}

const getText = (message: WAMessage): WATextMessage| string | null | undefined => {
  return message.message?.extendedTextMessage?.text
    ?? message?.message?.conversation
}

const sendWithTyping = async (socket: WASocket, message: AnyMessageContent, jid: string): Promise<void> => {
	await socket.presenceSubscribe(jid)
	await delay(500)

	await socket.sendPresenceUpdate('composing', jid)
	await delay(2000)

	await socket.sendPresenceUpdate('paused', jid)

	await socket.sendMessage(jid, message)
}

const getParticipants = async (socket: WASocket, jid: string): Promise<GroupParticipant[]> => {
	const groupMetadata: GroupMetadata = await socket.groupMetadata(jid)

	return groupMetadata.participants
}

export {
	getJid,
	getText,
	sendWithTyping,
	getParticipants,
}