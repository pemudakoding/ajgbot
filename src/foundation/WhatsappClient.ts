import { AuthenticationState, useMultiFileAuthState } from '@whiskeysockets/baileys';
import WhatsappClientContract from '../contracts/foundation/WhatsappClient';

import WhatsappConnection from './WhatsappConnection';

class WhatsappClient implements WhatsappClientContract {
  async start(): Promise<void> {
    const connection = new WhatsappConnection(this.resolveAuthentication)

    connection.connectToWhatsapp()
  }

  async resolveAuthentication(): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void>; }> {
    return await useMultiFileAuthState('ajgbotauth')
  }
}

export default WhatsappClient;