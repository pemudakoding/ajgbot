import * as baileys from '@whiskeysockets/baileys'
import {
	DownloadableMessage,
	downloadContentFromMessage, downloadMediaMessage,
	GroupMetadata,
	GroupParticipant, MediaType,
	MessageType,
	WAMessage,
	WASocket
} from "@whiskeysockets/baileys";
import {writeFile} from "fs/promises";
import logger from "../services/logger";

const getJid = (message: baileys.WAMessage): string => {
	return message.key.remoteJid ?? ''
}

const getText = (message: baileys.WAMessage): string => {
	return message.message?.extendedTextMessage?.text
		?? message?.message?.imageMessage?.caption
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

const downloadQuotedMessageMedia = async (message: baileys.proto.IMessage | undefined | null , path: string): Promise<string> => {

	if(message) {
		const type = Object.keys(message)[0] as MessageType
		const msg = message[type as keyof typeof message]

		const stream = await downloadContentFromMessage(
			msg as DownloadableMessage,
			type.replace('Message', '') as MediaType
		)
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}

		await writeFile(path, buffer)
	}

	return path
}

const downloadMessageMedia = async (message: WAMessage, socket: WASocket, path: string ): Promise<string> => {
	const buffer: Buffer | import("stream").Transform = await downloadMediaMessage(
		message,
		'buffer',
		{},
		{
			logger,
			reuploadRequest: socket.updateMediaMessage
		}
	)

	await writeFile(path, buffer)

	return path
}

const getGroupId = async (message: WAMessage, socket: WASocket): Promise<string> => {
	const metaData = await socket.groupMetadata(getJid(message))

	return metaData.id.replace('@g.us', '')
}

export {
	getJid,
	getText,
	sendWithTyping,
	getParticipants,
	react,
	isGroup,
	isParticipantAdmin,
	downloadQuotedMessageMedia,
	downloadMessageMedia,
	getGroupId
}