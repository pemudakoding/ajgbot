import * as baileys from '@whiskeysockets/baileys'
import type WhatsappClientContract from '../contracts/foundation/WhatsappClient'

import WhatsappConnection from './WhatsappConnection'

class WhatsappClient implements WhatsappClientContract {
  async start (): Promise<void> {
    const connection = new WhatsappConnection(
      async (): Promise<{ state: baileys.AuthenticationState, saveCreds: () => Promise<void> }> => await baileys.useMultiFileAuthState('ajgbotauth')
    )

    await connection.connectToWhatsapp()
  }
}

export default WhatsappClient
