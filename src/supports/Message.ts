import * as baileys from '@whiskeysockets/baileys'
import {
	DownloadableMessage,
	downloadContentFromMessage, downloadMediaMessage, getContentType,
	GroupMetadata,
	GroupParticipant, MediaDownloadOptions, MediaType,
	MessageType, proto,
	WAMessage,
	WASocket
} from "@whiskeysockets/baileys";
import {writeFile} from "fs/promises";
import logger from "../services/logger";
import {Buffer} from "buffer";

const getJid = (message: baileys.WAMessage): string => {
	return message.key.remoteJid ?? ''
}

const getText = (message: baileys.WAMessage): string => {
	if (!message) return "";

	const type = getContentType(message.message!)!;

	if(type === undefined) {
		return ''
	}

	const msg = type === 'viewOnceMessage'
		? message.message![type]!.message![getContentType(message.message![type]!.message!)!]
		: message.message![type] || '';

	const isTypeViewOnce = type == "viewOnceMessage" || type == "viewOnceMessageV2" || type == "viewOnceMessageV2Extension";

	return message.message?.extendedTextMessage?.text
		?? message?.message?.imageMessage?.caption
		?? (msg as proto.Message.IVideoMessage).caption
		?? (msg as proto.Message.IExtendedTextMessage)?.text
		?? ((isTypeViewOnce && (msg as proto.Message.FutureProofMessage).message?.imageMessage)
			? (msg as proto.Message.FutureProofMessage).message?.imageMessage?.caption
			: null
		)
		?? ((isTypeViewOnce && (msg as proto.Message.FutureProofMessage).message?.videoMessage)
			? (msg as proto.Message.FutureProofMessage).message?.videoMessage?.caption
			: null
		)
		?? message.message?.ephemeralMessage?.message?.extendedTextMessage?.text
		?? message?.message?.conversation
		?? ''
}

const getTextWithoutCommand = (message: baileys.WAMessage): string => {
	const text = getText(message);
	const commandRegex = /^\.\w+/;
	const match = text.match(commandRegex);

	if (match) {
		return text.replace(commandRegex, '').trimLeft();
	}

	return text;
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

const downloadMessageMedia = async (
	message: WAMessage,
	socket: WASocket,
	path: string | null = null,
	type: 'buffer' | 'write' = 'write',
): Promise<string | Buffer | import("stream").Transform> => {
	const buffer: Buffer | import("stream").Transform = await downloadMediaMessage(
		message,
		'buffer',
		{},
		{
			logger,
			reuploadRequest: socket.updateMediaMessage
		}
	)

	if(type === 'write' && path !== null) {
		await writeFile(path, buffer)

		return path
	}

	return buffer
}

const getGroupId = async (message: WAMessage): Promise<string> => {
	return message
		.key
		.remoteJid!
		.replace('@g.us', '')
}

const getMessageFromViewOnce = (
	message: WAMessage
): proto.IMessage | null | undefined => {
	return (
		message.message?.viewOnceMessage?.message ||
		message.message?.viewOnceMessageV2?.message ||
		message.message?.viewOnceMessageV2Extension?.message ||
		message.message
	);
};

const getMessageQuotedCaption = (message: proto.IMessage) => {
	const type = getContentType(message)!;
	const msg =
		type == "viewOnceMessage"
			? message[type]!.message![getContentType(message[type]!.message!)!]
			: message[type];

	return (
		message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo
			?.quotedMessage?.conversation ||
		message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
		message?.extendedTextMessage?.contextInfo?.quotedMessage
			?.extendedTextMessage?.text ||
		(msg as proto.Message.IVideoMessage)?.contextInfo?.quotedMessage
			?.conversation ||
		""
	);
};

const downloadContentBufferFromMessage = async (
	{ mediaKey, directPath, url }: DownloadableMessage,
	type: MediaType,
	opts?: MediaDownloadOptions
): Promise<Buffer> => {
	const stream = await downloadContentFromMessage(
		{ mediaKey, directPath, url },
		type,
		opts
	);
	const bufferArray: Buffer[] = [];
	for await (const chunk of stream) {
		bufferArray.push(chunk);
	}

	return Buffer.concat(bufferArray);
};

const getViewOnceInstance = (message: WAMessage) => {
	return message.message?.viewOnceMessage ||
		message.message?.viewOnceMessageV2 ||
		message.message?.viewOnceMessageV2Extension ||
		message;
}

const getJidNumber = (jid: string): string => {
	return jid
		.replace('@g.us', '')
		.replace('@s.whatsapp.net', '')
		.toString()
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
	getGroupId,
	getMessageFromViewOnce,
	getMessageQuotedCaption,
	downloadContentBufferFromMessage,
	getViewOnceInstance,
	getJidNumber,
	getTextWithoutCommand,
}