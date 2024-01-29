import * as baileys from '@whiskeysockets/baileys'

const getJid = (message: baileys.WAMessage): string => {
  return message.key.remoteJid ?? ''
}

const getText = (message: baileys.WAMessage): baileys.WATextMessage| string | null | undefined => {
  return message.message?.extendedTextMessage?.text
    ?? message?.message?.conversation
}

const sendWithTyping = async (socket: baileys.WASocket, message: baileys.AnyMessageContent, jid: string): Promise<void> => {
	await socket.presenceSubscribe(jid)
	await baileys.delay(500)

	await socket.sendPresenceUpdate('composing', jid)
	await baileys.delay(2000)

	await socket.sendPresenceUpdate('paused', jid)

	await socket.sendMessage(jid, message)
}

const getParticipants = async (socket: baileys.WASocket, jid: string): Promise<baileys.GroupParticipant[]> => {
	const groupMetadata: baileys.GroupMetadata = await socket.groupMetadata(jid)

	return groupMetadata.participants
}

export {
	getJid,
	getText,
	sendWithTyping,
	getParticipants,
}