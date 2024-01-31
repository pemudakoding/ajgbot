import * as baileys from '@whiskeysockets/baileys'
import {GroupMetadata, GroupParticipant, WASocket} from "@whiskeysockets/baileys";

const getJid = (message: baileys.WAMessage): string => {
  return message.key.remoteJid ?? ''
}

const getText = (message: baileys.WAMessage): string => {
  return message.message?.extendedTextMessage?.text
    ?? message?.message?.conversation
	?? ''
}

const sendWithTyping = async (socket: baileys.WASocket, message: baileys.AnyMessageContent, jid: string, options: baileys.MiscMessageGenerationOptions = {}): Promise<void> => {
	await socket.presenceSubscribe(jid)
	await baileys.delay(500)

	await socket.sendPresenceUpdate('composing', jid)
	await baileys.delay(2000)

	await socket.sendPresenceUpdate('paused', jid)

	await socket.sendMessage(jid, message, options)
}

const getParticipants = async (socket: baileys.WASocket, jid: string): Promise<baileys.GroupParticipant[]> => {
	const groupMetadata: baileys.GroupMetadata = await socket.groupMetadata(jid)

	return groupMetadata.participants
}

const react = async (socket: baileys.WASocket, emoji: string, message: baileys.WAMessage): Promise<void> => {
	socket.sendMessage(
		getJid(message),
		{
			react: {
				text: emoji,
				key: message.key
			}
		}
	)
}

const isGroup = (message: baileys.WAMessage): boolean => {
	return Boolean(message.key.participant)
}

const isParticipantAdmin = async (message: baileys.WAMessage, socket: WASocket): Promise<boolean> => {
	const groupMetadata: GroupMetadata = await socket.groupMetadata(getJid(message))

	const participant: GroupParticipant[] = groupMetadata
		.participants
		.filter((participant: GroupParticipant): boolean => participant.id === message.key.participant && participant.admin !== null)

	return participant.length > 0
}

export {
	getJid,
	getText,
	sendWithTyping,
	getParticipants,
	react,
	isGroup,
	isParticipantAdmin,
}