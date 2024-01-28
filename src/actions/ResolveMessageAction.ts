import { WASocket } from '@whiskeysockets/baileys';
import { BaileysEventMap } from '@whiskeysockets/baileys/lib/Types';
import { WAMessage} from '@whiskeysockets/baileys/lib/Types/Message';

class ResolveMessageAction {
  public static async execute(socket: WASocket,messages: BaileysEventMap['messages.upsert']): Promise<void> {
    const messageInformations: WAMessage[] = messages.messages

      for(const message of messageInformations) {

      }
  }
}

export default ResolveMessageAction