import { WASocket } from '@whiskeysockets/baileys';
import { BaileysEventMap } from '@whiskeysockets/baileys/lib/Types';
import { WAMessage, WATextMessage } from '@whiskeysockets/baileys/lib/Types/Message';

class ResolveMessageAction {

  public static async execute(socket: WASocket,messages: BaileysEventMap['messages.upsert']): Promise<void> {
    const messageInformations: WAMessage[] = messages.messages

      for(let message of messageInformations) {
        const messageInformation: WATextMessage | null | undefined = message.message?.extendedTextMessage
        const messageAuthorJid: string | null | undefined = message.key.remoteJid;

        if((messageInformation?.text === 'ping' || message?.message?.conversation === 'ping') && messageAuthorJid) {
          await socket.sendMessage(messageAuthorJid, {text: 'pong!'})
        }
      }
  }
}

export default ResolveMessageAction