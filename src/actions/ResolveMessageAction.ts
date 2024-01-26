import { BaileysEventMap } from '@whiskeysockets/baileys/lib/Types';
import { WASocket } from '@whiskeysockets/baileys';
import { WAMessage, WATextMessage } from '@whiskeysockets/baileys/lib/Types/Message';

class ResolveMessageAction
{
  public static execute(socket: WASocket): void {
    socket.ev.on('messages.upsert', async (messages: BaileysEventMap['messages.upsert']) => {
      const messageInformations: WAMessage[] = messages.messages

      for(let message of messageInformations) {
        const messageInformation: WATextMessage | null | undefined = message.message?.extendedTextMessage
        const messageAuthorJid: string | null | undefined = message.key.remoteJid;

        if((messageInformation?.text === 'ping' || message?.message?.conversation === 'ping') && messageAuthorJid) {
          await socket.sendMessage(messageAuthorJid, {text: 'pong!'})
        }
      }
    })
  }
}

export default ResolveMessageAction