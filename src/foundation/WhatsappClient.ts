import { useMultiFileAuthState } from '@whiskeysockets/baileys'
import type { AuthenticationState } from '@whiskeysockets/baileys';
import type WhatsappClientContract from '../contracts/foundation/WhatsappClient'

import WhatsappConnection from './WhatsappConnection'

class WhatsappClient implements WhatsappClientContract {
  async start (): Promise<void> {
    const connection = new WhatsappConnection(
      async (): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> => await useMultiFileAuthState('ajgbotauth')
    )

    await connection.connectToWhatsapp()
  }
}

export default WhatsappClient
